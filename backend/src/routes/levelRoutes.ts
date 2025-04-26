import express from 'express';
import { LevelController } from '../controllers/levelController';
import { validateUser } from '../middleware/validateUser';
import { requireAuth } from '../middleware/requireAuth';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all levels (optionally with user progress)
router.get('/', LevelController.getAllLevels);

// Get all levels with progress for a user
router.get('/all/:userId', validateUser, LevelController.getAllLevelsForUser);

// Save all progress for a user
router.post('/all/:userId', validateUser, LevelController.saveAllProgress);

// Get specific level progress
router.get('/:levelId/:userId', validateUser, LevelController.getLevelProgress);

// Save specific level progress
router.post('/:levelId/:userId', validateUser, LevelController.saveLevelProgress);

export default router; 