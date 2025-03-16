import { PrismaClient } from "@prisma/client";

const isTestEnv = process.env.NODE_ENV === "test";
let prismaInstance: PrismaClient | null = null;

export const getPrisma = async (): Promise<PrismaClient> => {
    if (prismaInstance) {
        return prismaInstance;
    }

    if (isTestEnv) {
        try {
            const { prismaTestClient } = await import("../test/db");
            console.log("📢 Using Test Prisma Client");
            prismaInstance = prismaTestClient;
        } catch (error) {
            console.log("Error loading test Prisma Client:", error);
            prismaInstance = new PrismaClient(); // Fallback to avoid crashes
        }
    } else {
        console.log("📢 Using Regular Prisma Client");
        prismaInstance = new PrismaClient();
    }

    return prismaInstance;
};
