import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { hashPassword, verifyPassword } from './password.service';
import { generateOpaqueToken, hashToken } from '../../utils/hash';
import { env } from '../../config/env';
import { revokeAllUserTokens } from './refreshToken.service';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MIN = 15;

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Generic message — don't reveal which emails are already registered
    // via a different error than the one used elsewhere.
    throw AppError.conflict('An account with this email may already exist', 'EMAIL_IN_USE');
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Constant-shape response whether the user exists or not, to avoid
  // leaking account existence via timing or message differences.
  if (!user) {
    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw AppError.forbidden(
      'Account temporarily locked due to repeated failed login attempts. Try again later.',
      'ACCOUNT_LOCKED',
    );
  }

  const valid = await verifyPassword(user.passwordHash, password);

  if (!valid) {
    const failedLoginCount = user.failedLoginCount + 1;
    const shouldLock = failedLoginCount >= MAX_FAILED_ATTEMPTS;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: shouldLock ? 0 : failedLoginCount,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCK_DURATION_MIN * 60 * 1000)
          : null,
      },
    });

    throw AppError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  if (user.failedLoginCount > 0 || user.lockedUntil) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginCount: 0, lockedUntil: null },
    });
  }

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always behave the same way whether or not the account exists, so the
  // endpoint can't be used to enumerate registered emails.
  if (!user) return null;

  const token = generateOpaqueToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MIN * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  // --- Email sending is simulated here ---
  // In production, plug in a provider (SES, Postmark, Resend, SendGrid...)
  // and email a link like `${CLIENT_URL}/reset-password?token=${token}`.
  // We log it instead so the flow is testable end-to-end without an SMTP
  // account.
  console.log(`[password-reset] token for ${email}: ${token}`);

  return token; // returned only for local/dev/test convenience
};

export const resetPassword = async (token: string, newPassword: string) => {
  const tokenHash = hashToken(token);
  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw AppError.badRequest('Reset link is invalid or has expired', 'RESET_TOKEN_INVALID');
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  // Invalidate every existing session — if an attacker had a stolen
  // refresh token, this resetting the password kicks them out too.
  await revokeAllUserTokens(resetToken.userId);
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const valid = await verifyPassword(user.passwordHash, currentPassword);

  if (!valid) {
    throw AppError.unauthorized('Current password is incorrect', 'INVALID_CREDENTIALS');
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  await revokeAllUserTokens(userId);
};
