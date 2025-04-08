import getPrisma from "../config/db"
import { NotFoundError } from "../errors";
import { GameLevel } from "../models/GameLevel";
import { UserProgress } from "../models/UserProgress";

export class LevelService {
    // Load both level data and user progress
    static async getLevelWithProgress(userId: string, levelId: string): Promise<{level: GameLevel, progress: UserProgress}> {
        const prisma = await getPrisma();
        
        // Get level and progress in parallel
        const [levelData, progressData] = await Promise.all([
            prisma.levels.findUnique({
                where: { id: levelId }
            }),
            prisma.user_progress.findUnique({
                where: {
                    user_id_level_id: {
                        user_id: userId,
                        level_id: levelId
                    }
                }
            })
        ]);

        if (!levelData) {
            throw new NotFoundError(`Level with ID ${levelId} not found`);
        }

        // Create GameLevel instance
        const level = new GameLevel(levelData);

        // If no progress exists, create initial progress
        if (!progressData) {
            const newProgress = await this.initializeUserProgress(userId, levelId);
            return { level, progress: newProgress };
        }

        // Create UserProgress instance
        const progress = new UserProgress(progressData);

        return { level, progress };
    }

    // Initialize new progress for a user on a level
    private static async initializeUserProgress(userId: string, levelId: string): Promise<UserProgress> {
        const prisma = await getPrisma();
        
        const progressData = await prisma.user_progress.create({
            data: {
                user_id: userId,
                level_id: levelId,
                completed: false,
                test_case_results: [],
                attempts: 0
            }
        });

        return new UserProgress(progressData);
    }

    // Save user progress
    static async saveProgress(progress: UserProgress): Promise<UserProgress> {
        const prisma = await getPrisma();
        
        const updatedData = await prisma.user_progress.update({
            where: {
                user_id_level_id: {
                    user_id: progress.userId,
                    level_id: progress.levelId
                }
            },
            data: progress.toJSON()
        });

        return new UserProgress(updatedData);
    }

    // Get all available levels (possibly with user progress)
    static async getAllLevels(userId?: string): Promise<GameLevel[]> {
        const prisma = await getPrisma();
        
        const levels = await prisma.levels.findMany({
            orderBy: { created_at: 'asc' },
            include: userId ? {
                user_progress: {
                    where: { user_id: userId }
                }
            } : undefined
        });

        return levels.map((level: any) => new GameLevel(level));
    }
} 