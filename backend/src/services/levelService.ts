import { Prisma } from '@prisma/client';
import { getPrisma } from "../config/db"
import { NotFoundError } from "../errors";
import { GameLevel } from "../models/GameLevel";
import { UserProgress } from "../models/UserProgress";

interface SaveProgressData {
    userId: string;
    levelId: string;
    status: string;
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
                status: 'incomplete',
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
                    status: data.status,
                    updated_at: new Date()
                },
                create: {
                    user_id: data.userId,
                    level_id: data.levelId,
                    status: data.status
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

    // Get level progress
    static async getLevelProgress(userId: string, levelId: string) {
        const prisma = await getPrisma();
        
        const progress = await prisma.user_progress.findUnique({
            where: {
                user_id_level_id: {
                    user_id: userId,
                    level_id: levelId
                }
            }
        });
        
        if (!progress) {
            // Return default values if no progress exists
            return {
                status: 'locked',
                current_solution: ''
            };
        }
        
        return progress;
    }

    // Get all levels with progress for a user
    static async getAllLevelsWithProgress(userId: string) {
        const prisma = await getPrisma();
        
        const levels = await prisma.levels.findMany({
            orderBy: { id: 'asc' },
            select: {
                id: true,
                title: true,
                user_progress: {
                    where: { user_id: userId },
                    select: { status: true }
                }
            }
        });
        
        return levels.map(level => ({
            levelId: level.id,
            status: level.user_progress[0]?.status || 'incomplete'
        }));
    }

    // Save all progress for a user
    static async saveAllProgress(userId: string, progressData: Array<{levelId: string, status: string}>) {
        const prisma = await getPrisma();
        
        const results = [];
        
        for (const item of progressData) {
            const result = await prisma.user_progress.upsert({
                where: {
                    user_id_level_id: {
                        user_id: userId,
                        level_id: item.levelId
                    }
                },
                update: {
                    status: item.status,
                    updated_at: new Date()
                },
                create: {
                    user_id: userId,
                    level_id: item.levelId,
                    status: item.status
                }
            });
            
            results.push(result);
        }
        
        return results;
    }

    // Save level progress
    static async saveLevelProgress(data: {
        userId: string;
        levelId: string;
        status: string;
        currentSolution?: string;
    }) {
        const prisma = await getPrisma();
        
        return prisma.user_progress.upsert({
            where: {
                user_id_level_id: {
                    user_id: data.userId,
                    level_id: data.levelId
                }
            },
            update: {
                status: data.status,
                current_solution: data.currentSolution || '',
                updated_at: new Date()
            },
            create: {
                user_id: data.userId,
                level_id: data.levelId,
                status: data.status,
                current_solution: data.currentSolution || ''
            }
        });
    }
} 