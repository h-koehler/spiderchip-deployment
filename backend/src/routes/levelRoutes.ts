import express from 'express';
import { LevelController } from '../controllers/levelController';
import { validateUser } from '../middleware/validateUser';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all levels (optionally with user progress)
router.get('/', LevelController.getAllLevels);

// Get specific level with user progress - protected by validateUser
router.get('/:levelId/progress/:userId', validateUser, LevelController.getLevelWithProgress);

// Save progress - protected by validateUser
router.post('/progress', validateUser, LevelController.saveProgress);

export default router; 