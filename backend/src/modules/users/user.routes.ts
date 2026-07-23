import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth';
import { requireRole } from '../../middleware/requireRole';
import { listUsers } from './user.controller';

const router = Router();

// Example protected + role-restricted route: only admins can list users.
router.get('/', requireAuth, requireRole('ADMIN'), listUsers);

export default router;
