import ms from '../../utils/ms';
import { prisma } from '../../config/prisma';
import { env } from '../../config/env';
import { generateOpaqueToken, hashToken } from '../../utils/hash';
import { AppError } from '../../utils/AppError';

interface IssueMeta {
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Refresh tokens are opaque random strings (not JWTs) stored hashed in the
 * DB. This gives us two things a stateless JWT refresh token can't:
 *  1. Revocation (logout, password change, admin action) takes effect
 *     immediately instead of waiting for expiry.
 *  2. Rotation with reuse detection: every refresh issues a brand-new
 *     token and revokes the old one. If a revoked/used token is presented
 *     again, it's a signal of token theft — we revoke the *entire* token
 *     family for that user as a precaution.
 */
export const issueRefreshToken = async (userId: string, meta: IssueMeta = {}) => {
  const token = generateOpaqueToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
    },
  });

  return { token, expiresAt };
};

export const rotateRefreshToken = async (presentedToken: string, meta: IssueMeta = {}) => {
  const tokenHash = hashToken(presentedToken);
  const existing = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!existing) {
    throw AppError.unauthorized('Invalid refresh token', 'REFRESH_INVALID');
  }

  if (existing.revokedAt || existing.expiresAt < new Date()) {
    // Reuse of a revoked/expired token → possible theft. Nuke the family.
    await prisma.refreshToken.updateMany({
      where: { userId: existing.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw AppError.unauthorized('Refresh token expired or already used', 'REFRESH_REUSED');
  }

  const { token: newToken, expiresAt } = await issueRefreshToken(existing.userId, meta);

  await prisma.refreshToken.update({
    where: { id: existing.id },
    data: { revokedAt: new Date(), replacedBy: newToken },
  });

  return { newToken, expiresAt, user: existing.user };
};

export const revokeRefreshToken = async (presentedToken: string) => {
  const tokenHash = hashToken(presentedToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};

export const revokeAllUserTokens = async (userId: string) => {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};
