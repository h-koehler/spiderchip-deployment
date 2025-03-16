import { PrismaClient } from "@prisma/client";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from 'child_process';
import { seedRoles } from "./repositories";

let pgContainer: StartedPostgreSqlContainer;
let prismaTestClient: PrismaClient;

export const startTestDatabase = async () => {
    console.log("🧪 Starting Testcontainers PostgreSQL...");

    // Start PostgreSQL container
    pgContainer = await new PostgreSqlContainer().start();
    const connectionUri = pgContainer.getConnectionUri();
    process.env.DATABASE_URL = connectionUri;
    process.env.DIRECT_URL = connectionUri;
    process.env.SHADOW_DATABASE_URL = connectionUri;

    console.log(`🔗 Test DB Running at: ${connectionUri}`);

    prismaTestClient = new PrismaClient();
    await prismaTestClient.$connect();
    await prismaTestClient.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    execSync(`cross-env NODE_ENV=test DATABASE_URL=${connectionUri} DIRECT_URL=${connectionUri} SHADOW_DATABASE_URL=${connectionUri} npx prisma db push`, {
        stdio: "inherit",
    });

    console.log("✅ Test Database Ready.");
    await seedRoles();
};

export const stopTestDatabase = async () => {
    await prismaTestClient.$disconnect();
    await pgContainer.stop();
    console.log("✅ Database Stopped.");
};

export { prismaTestClient };
