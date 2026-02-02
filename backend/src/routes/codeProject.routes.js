import express from 'express';
import * as codeProjectController from '../controllers/codeProject.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { optionalAuth } from '../middleware/optionalAuth.middleware.js';

const router = express.Router();

/**
 * Public routes (no auth required)
 */
router.get('/public', codeProjectController.getPublicProjects);
router.get('/trending', codeProjectController.getTrendingProjects);
router.get('/search', codeProjectController.searchProjects);

/**
 * Routes with optional authentication
 */
router.get('/:id', optionalAuth, codeProjectController.getProjectById);
router.get('/:id/stats', codeProjectController.getProjectStats);

/**
 * Protected routes (auth required)
 */
router.use(authenticate);

router.post('/', codeProjectController.createProject);
router.get('/my-projects', codeProjectController.getMyProjects);
router.patch('/:id', codeProjectController.updateProject);
router.delete('/:id', codeProjectController.deleteProject);
router.post('/:id/like', codeProjectController.toggleLike);
router.post('/:id/fork', codeProjectController.forkProject);

export default router;
