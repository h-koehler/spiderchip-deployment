import { Prisma } from '@prisma/client';
import { getPrisma } from "../config/db"
import { NotFoundError } from "../errors";
import { GameLevel } from "../models/GameLevel";
import { UserProgress } from "../models/UserProgress";

interface SaveProgressData {
    userId: string;
    levelId: number;
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

    // Get level progress
    static async getLevelProgress(userId: string, levelId: number) {
        const prisma = await getPrisma();
        
        const progress = await prisma.user_progress.findUnique({
            where: {
                user_id_level_id: {
                    user_id: userId,
                    level_id: levelId
                }
            },
            select: {
                status: true,
                current_solution: true
            }
        });
        
        if (!progress) {
            throw new NotFoundError('Level progress not found');
        }
        
        return {
            status: progress.status,
            code: progress.current_solution
        };
    }

    // Get all levels with progress for a user
    static async getAllLevelsWithProgress(userId: string) {
        const prisma = await getPrisma();
        
        // Just get the user progress entries directly
        const progress = await prisma.user_progress.findMany({
            where: { user_id: userId },
            select: {
                level_id: true,
                status: true
            }
        });
        
        // Map to the expected format
        return progress.map(item => ({
            levelId: item.level_id,
            status: item.status
        }));
    }

    // Save all progress for a user
    static async saveAllProgress(userId: string, progressData: Array<{levelId: number, status: string}>) {
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
                    status: item.status,
                    current_solution: ""
                }
            });
            
            results.push({
                levelId: result.level_id,
                status: result.status
            });
        }
        
        return results;
    }

    // Save level progress
    static async saveLevelProgress(data: {
        userId: string;
        levelId: number;
        status: string;
        currentSolution: string;
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
                current_solution: data.currentSolution,
                updated_at: new Date()
            },
            create: {
                user_id: data.userId,
                level_id: data.levelId,
                status: data.status,
                current_solution: data.currentSolution
            }
        });
    }
} 