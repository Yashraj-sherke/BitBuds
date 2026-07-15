import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;

/** User profile routes mounted at /api/v1/users */
export const userRouter = Router();
userRouter.use(authenticate);
userRouter.get('/', authController.getAllUsers);
userRouter.get('/:userId', authController.getUserById);
userRouter.patch('/:userId', authController.updateUser);
