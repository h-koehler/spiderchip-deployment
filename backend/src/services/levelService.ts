import { Prisma } from '@prisma/client';
import { getPrisma } from "../config/db"
import { NotFoundError } from "../errors";
import { GameLevel } from "../models/GameLevel";
import { UserProgress } from "../models/UserProgress";

interface SaveProgressData {
    userId: string;
    levelId: string;
    completed: boolean;
    submissionData: {
        code: string;
        testResults: Array<{
            testCaseId: number;
            passed: boolean;
        }>;
    };
}

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
    static async saveProgress(data: SaveProgressData) {
        const prisma = await getPrisma();
        
        return prisma.$transaction(async (tx) => {
            // Update user_progress
            await tx.user_progress.upsert({
                where: {
                    user_id_level_id: {
                        user_id: data.userId,
                        level_id: data.levelId
                    }
                },
                update: {
                    completed: data.completed,
                    updated_at: new Date()
                },
                create: {
                    user_id: data.userId,
                    level_id: data.levelId,
                    completed: data.completed,
                    test_case_results: []
                }
            });

            // Store submission data
            return tx.submissions.upsert({
                where: {
                    user_id_level_id: {
                        user_id: data.userId,
                        level_id: data.levelId
                    }
                },
                update: {
                    submission_data: data.submissionData as Prisma.InputJsonValue,
                    updated_at: new Date()
                },
                create: {
                    user_id: data.userId,
                    level_id: data.levelId,
                    submission_data: data.submissionData as Prisma.InputJsonValue
                }
            });
        });
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

    static async getLevelProgress(userId: string, levelId: string) {
        const prisma = await getPrisma();

        const [progress, submission] = await Promise.all([
            prisma.user_progress.findUnique({
                where: {
                    user_id_level_id: {
                        user_id: userId,
                        level_id: levelId
                    }
                }
            }),
            //I want to get the latest submission for the user on the level here
            prisma.submissions.findFirst({
                where: {
                    user_id: userId,
                    level_id: levelId
                },
                orderBy: {
                    updated_at: 'desc'
                }
            })
        ]);

        if (!progress && !submission) {
            throw new NotFoundError('No progress found for this level');
        }

        return {
            completed: progress?.completed ?? false,
            code: (submission?.submission_data as any)?.code ?? '',
            testResults: (submission?.submission_data as any)?.testResults ?? []
        };
    }
} 