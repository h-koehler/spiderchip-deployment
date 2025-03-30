import express from 'express';
import { LevelController } from '../controllers/levelController';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all levels (optionally with user progress)
router.get('/', LevelController.getAllLevels);

// Get specific level with user progress
router.get('/:levelId/progress/:userId', LevelController.getLevelWithProgress);

// Save progress
router.post('/progress', LevelController.saveProgress);

export default router; 