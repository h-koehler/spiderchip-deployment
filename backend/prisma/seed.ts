import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.user_progress.deleteMany({});
    await prisma.levels.deleteMany({});

    // Create test levels
    const level1 = await prisma.levels.create({
        data: {
            title: "Introduction to Assembly",
            description: "Learn the basics of assembly programming with a simple addition task.",
            input_data: {
                puzzleData: {
                    initialState: {
                        registers: { "A": 0, "B": 0 },
                        memory: [5, 3]
                    },
                    constraints: [
                        "Must use ADD instruction",
                        "Maximum 5 instructions"
                    ],
                    availableCommands: ["LOAD", "ADD", "STORE"]
                },
                testCases: [
                    {
                        input: [5, 3],
                        expectedOutput: [8],
                        description: "Adding two positive numbers"
                    },
                    {
                        input: [2, 4],
                        expectedOutput: [6],
                        description: "Different positive numbers"
                    }
                ],
                metadata: {
                    estimatedTime: 10,
                    prerequisites: []
                }
            }
        }
    });

    const level2 = await prisma.levels.create({
        data: {
            title: "Conditional Jumps",
            description: "Learn how to use conditional jumps to make decisions.",
            input_data: {
                puzzleData: {
                    initialState: {
                        registers: { "A": 0 },
                        memory: [4, 7]
                    },
                    constraints: [
                        "Must use at least one JMP instruction",
                        "Maximum 8 instructions"
                    ],
                    availableCommands: ["LOAD", "CMP", "JMP", "JGT", "STORE"]
                },
                testCases: [
                    {
                        input: [4, 7],
                        expectedOutput: [7],
                        description: "Finding the larger number"
                    },
                    {
                        input: [9, 3],
                        expectedOutput: [9],
                        description: "First number is larger"
                    }
                ],
                metadata: {
                    estimatedTime: 15,
                    prerequisites: [level1.id]
                }
            }
        }
    });

    console.log('Seed data created:', { level1, level2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 