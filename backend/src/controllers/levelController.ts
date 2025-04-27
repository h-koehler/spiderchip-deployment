import { Request, Response, NextFunction } from 'express';
import { LevelService } from '../services/levelService';
import { BadRequestError, NotFoundError } from '../errors';

export class LevelController {
    // Get level with user progress
    static async getLevelWithProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const data = await LevelService.getLevelProgress(userId, parseInt(levelId));
            res.json(data);
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

            await LevelService.saveProgress({
                userId: userId!,
                levelId: parseInt(levelId),
                status,
                submissionData: {
                    code,
                    testResults
                }
            });

            res.send();
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
            const progressData = req.body.map((item: any) => ({
                ...item,
                levelId: parseInt(item.levelId)
            }));
            
            await LevelService.saveAllProgress(userId, progressData);
            res.send();
        } catch (error) {
            next(error);
        }
    }

    // Get specific level progress
    static async getLevelProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const data = await LevelService.getLevelProgress(userId, parseInt(levelId));
            res.json(data);
        } catch (error) {
            if (error instanceof NotFoundError) {
                res.status(404).json({ error: error.message });
            } else {
                next(error);
            }
        }
    }

    // Save specific level progress
    static async saveLevelProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, levelId } = req.params;
            const { status, code } = req.body;
            
            await LevelService.saveLevelProgress({
                userId,
                levelId: parseInt(levelId),
                status,
                currentSolution: code
            });
            res.send();
        } catch (error) {
            next(error);
        }
    }
} 
