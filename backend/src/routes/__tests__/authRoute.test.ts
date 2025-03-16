import request from "supertest";
import app from "../../app";
import { createTestUser, createAdminUser, getTestUserDTO } from "../../test/repositories";
import { getPrisma } from "../../config/db";
import { User, UserRequest } from "../../models/User";
import { loginUser } from "../../services/authService";

describe("Auth Controller Tests", () => {
    let testUser: UserRequest;
    let adminUser: UserRequest;
    const BASE_URI = "/api/auth"

    beforeAll(async () => {
        testUser = await createTestUser();
        adminUser = await createAdminUser();
    });

    afterAll(async () => {
        const prisma = await getPrisma();
        await prisma.users.deleteMany();
    });

    test("should register a new user", async () => {
        const { hashed_password, ...user } = await getTestUserDTO();
        const response = await request(app).post(`${BASE_URI}/register`).send(user);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("token");
    });

    test("should not allow duplicate registration", async () => {
        const response = await request(app).post(`${BASE_URI}/register`).send({
          username: testUser.username,
          email: testUser.email,
          password: testUser.password
        });
        expect(response.status).toBe(409);
        expect(response.body.errors).toContainEqual({ message: "User already exists" });
    });

    test("should authenticate an existing user", async () => {
        const response = await request(app).post(`${BASE_URI}/login`).send({
            email: testUser.email,
            password: testUser.password,
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
    });

    test("should reject login with incorrect password", async () => {
        const response = await request(app).post(`${BASE_URI}/login`).send({
            email: testUser.email,
            password: "WrongPassword123",
        });

        expect(response.status).toBe(401);
        expect(response.body.errors).toContainEqual({ message: "Invalid password" });
    });

    test("should return the current user", async () => {
        // First, log in to get a valid token
        const loginResponse = await loginUser({
          email: testUser.email,
          password: testUser.password
        });

        const token = loginResponse?.token;

        // Use token to get current user details
        const response = await request(app).get(`${BASE_URI}/current-user`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("email", testUser.email);
    });

    test("should deny access to current-user without token", async () => {
        const response = await request(app).get(`${BASE_URI}/current-user`);

        expect(response.status).toBe(401);
        expect(response.body.errors).toContainEqual({ message: "Access denied. No token provided." });
    });
});
