import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { prisma } from '../../config/prisma';

/** Admin-only: list all users. Demonstrates role-based authorization. */
export const listUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ users });
});
