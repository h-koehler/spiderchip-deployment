import { Request, Response, NextFunction } from 'express';
import { LevelService } from '../services/levelService';
import { BadRequestError } from '../errors';

export class LevelController {
    // Get level with user progress
    static async getLevelWithProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const data = await LevelService.getLevelProgress(userId, levelId);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // Get all levels
    static async getAllLevels(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id; // From JWT token
            const levels = await LevelService.getAllLevels(userId);
            res.json(levels);
        } catch (error) {
            next(error);
        }
    }

    // Save progress
    static async saveProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { levelId, status, code, testResults } = req.body;
            const userId = req.user?.id; // From JWT token
            if (!userId) {
                throw new BadRequestError('User ID is required');
            }

            const data = await LevelService.saveProgress({
                userId: userId!,
                levelId,
                status,
                submissionData: {
                    code,
                    testResults
                }
            });
            
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // Get all levels with progress for a user
    static async getAllLevelsForUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const data = await LevelService.getAllLevelsWithProgress(userId);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // Save all progress for a user
    static async saveAllProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const progressData = req.body; // Array of {levelId, status}
            const data = await LevelService.saveAllProgress(userId, progressData);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // Get level progress
    static async getLevelProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const data = await LevelService.getLevelProgress(userId, levelId);
            res.json({
                status: data.status,
                code: data.current_solution || ''
            });
        } catch (error) {
            next(error);
        }
    }

    // Save level progress
    static async saveLevelProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const { status, code } = req.body;
            
            const data = await LevelService.saveLevelProgress({
                userId,
                levelId,
                status,
                currentSolution: code
            });
            
            res.json({
                status: data.status,
                code: data.current_solution || ''
            });
        } catch (error) {
            next(error);
        }
    }
} 