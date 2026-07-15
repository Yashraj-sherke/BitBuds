import { Router } from 'express';
import * as statsController from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/global', statsController.getGlobalStats);
router.get('/leaderboard', authenticate, statsController.getLeaderboard);

router.use(authenticate);
router.get('/me', statsController.getMyStats);
router.get('/dashboard', statsController.getDashboard);
router.get('/rank', statsController.getMyRank);
router.get('/category-progress', statsController.getCategoryProgress);
router.get('/achievements', statsController.getAchievements);
router.get('/activity', statsController.getActivity);
router.post('/streak', statsController.updateStreak);
router.post('/progress', statsController.syncGameProgress);

export default router;

/** Badge routes mounted at /api/v1/badges */
export const badgeRouter = Router();
badgeRouter.use(authenticate);
badgeRouter.get('/', statsController.getAllBadges);
badgeRouter.get('/my-badges', statsController.getUserBadges);
badgeRouter.get('/available', statsController.getAvailableBadges);
badgeRouter.post('/check-eligibility', statsController.checkBadgeEligibility);
badgeRouter.get('/:id', statsController.getBadgeById);
