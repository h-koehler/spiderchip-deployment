import request from "supertest";
import fs from "fs";
import path from "path";
import app from "../app";
import { pool } from "./db";

declare global {
  var signin: (role?: string) => Promise<string>;
}

// Function to execute SQL files from the schema folder
const runSqlFile = async (filePath: string) => {
  const sql = fs.readFileSync(filePath, "utf8");
  await pool.query(sql);
};

// Run schema SQL files before running tests
beforeAll(async () => {
  if (process.env.NODE_ENV === "test") {
    console.log("Running schema SQL files for test database...");

    const schemaFolder = path.join(__dirname, "../schema");
    const sqlFiles = fs.readdirSync(schemaFolder).filter(file => file.endsWith(".sql"));

    for (const file of sqlFiles) {
      console.log(`Executing ${file}...`);
      await runSqlFile(path.join(schemaFolder, file));
    }

    console.log("Schema setup completed!");
  }
});

// Mock all `pool.query()` calls to avoid `undefined` responses
jest.spyOn(pool, "query").mockImplementation(async (query, values) => {
  if (query.includes("SELECT * FROM users WHERE email = $1")) {
    return { rows: [] }; // ✅ Prevents `undefined` error
  }
  return { rows: [] }; // Default empty result
});

// before each test, clean up the database
beforeEach(async () => {
  if (process.env.NODE_ENV === "test") {
    jest.clearAllMocks();
    console.log("Cleaning test database...");
    await pool.query("DELETE FROM user_roles;");
    await pool.query("DELETE FROM users;");
    await pool.query("DELETE FROM roles;");
  }
});

// after all tests, close database connection
afterAll(async () => {
  await pool.end();
});

// global function to sign in a test user and return a JWT token
global.signin = async (role: string = "user"): Promise<string> => {
  const email = `test+${Math.random()}@spiderchip.com`;
  const password = "TestPassword123!";

  // send request to register a new user
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      first_name: "Test",
      last_name: "User",
      email,
      password,
      role,
    })
    .expect(201);

  // extract token from the response
  const token = response.body.token;
  if (!token) {
    throw new Error("No token returned from signup");
  }

  return token;
};
