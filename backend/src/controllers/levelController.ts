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
            const { levelId, completed, code, testResults } = req.body;
            const userId = req.user?.id; // From JWT token
            if (!userId) {
                throw new BadRequestError('User ID is required');
            }

            const data = await LevelService.saveProgress({
                userId: userId!,
                levelId,
                completed,
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
} 