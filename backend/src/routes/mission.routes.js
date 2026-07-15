import { Router } from 'express';
import * as missionController from '../controllers/mission.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', missionController.getAllMissions);
router.get('/my-missions', missionController.getUserMissions);
router.get('/category/:category', missionController.getMissionsByCategory);
router.get('/:id', missionController.getMissionById);
router.post('/:id/start', missionController.startMission);
router.post('/:id/submit', missionController.submitMission);

export default router;
