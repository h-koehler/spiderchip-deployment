import request from "supertest";
import app from "../../app";
import { createTestUser, createAdminUser } from "../../test/repositories";
import { getPrisma } from "../../config/db";
import { loginUser } from "../../services/authService";
import { UserRequest } from "../../models/User";

describe("RBAC (Role-Based Access Control) Tests", () => {
    let testUser: UserRequest;
    let adminUser: UserRequest;
    const BASE_URI = "/api/test";

    beforeAll(async () => {
        testUser = await createTestUser();
        adminUser = await createAdminUser();
    });

    afterAll(async () => {
        const prisma = await getPrisma();
        await prisma.users.deleteMany();
    });

    test("should allow access to admin route for admin users", async () => {
        const loginResponse = await loginUser({
            email: adminUser.email,
            password: adminUser.password
        });

        const token = loginResponse?.token;

        const response = await request(app).get(`${BASE_URI}/admin-test`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Access granted: Admin Route");
    });

    test("should deny access to admin route for regular users", async () => {
        const loginResponse = await loginUser({
            email: testUser.email,
            password: testUser.password
        });

        const token = loginResponse?.token;

        const response = await request(app).get(`${BASE_URI}/admin-test`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
        expect(response.body.errors).toContainEqual("Forbidden: You do not have the required permissions.");
    });

    test("should allow access to user route for regular users", async () => {
        const loginResponse = await loginUser({
            email: testUser.email,
            password: testUser.password
        });

        const token = loginResponse?.token;

        const response = await request(app).get(`${BASE_URI}/user-test`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Access granted: User Route");
    });

    test("should allow access to user route for admin users", async () => {
        const loginResponse = await loginUser({
            email: adminUser.email,
            password: adminUser.password
        });

        const token = loginResponse?.token;

        const response = await request(app).get(`${BASE_URI}/user-test`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Access granted: User Route");
    });

    test("should deny access to admin route for unauthenticated users", async () => {
        const response = await request(app).get(`${BASE_URI}/admin-test`);

        expect(response.status).toBe(401);
        expect(response.body.errors).toContainEqual("Access denied. No token provided.");
    });

    test("should deny access to user route for unauthenticated users", async () => {
        const response = await request(app).get(`${BASE_URI}/user-test`);

        expect(response.status).toBe(401);
        expect(response.body.errors).toContainEqual("Access denied. No token provided.");
    });
});
