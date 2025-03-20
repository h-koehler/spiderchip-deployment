import { startTestDatabase, stopTestDatabase } from "./db";
import { seedRoles } from "./repositories";

beforeAll(async () => {
    await startTestDatabase();
    console.log("✅ Test Database Setup Complete.");
});

afterAll(async () => {
    await stopTestDatabase();
});
