import request from "supertest";
import app from "../../app";
import { createAdminUser, createTestUser } from "../../test/repositories";
import { getPrisma } from "../../config/db";
import { loginUser } from "../../services/authService";
import { UserRequest, UserResponse } from "../../models/User";

describe("Role Route Tests", () => {
  let adminUser: UserRequest;
  let normalUser: UserRequest;
  let adminToken: string;
  let userToken: string;
  let createdRoleId: string;
  const BASE_URI = "/api/role";

  beforeAll(async () => {
    adminUser = await createAdminUser();
    normalUser = await createTestUser();

    const { token: adminT } = (await loginUser({
      email: adminUser.email,
      password: adminUser.password,
    })) as UserResponse;

    const { token: userT } = (await loginUser({
      email: normalUser.email,
      password: normalUser.password,
    })) as UserResponse;

    adminToken = adminT;
    userToken = userT;
  });

  afterAll(async () => {
    const prisma = await getPrisma();
    await prisma.users.deleteMany();
    await prisma.roles.deleteMany();
  });

  // Admin-only route tests

  test("admin should create a new role", async () => {
    const response = await request(app)
      .post(`${BASE_URI}/`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "editor", description: "Editor role" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("editor");
    createdRoleId = response.body.id;
  });

  test("admin should fetch all roles", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("admin should fetch role by ID", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/${createdRoleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdRoleId);
  });

  test("admin should fetch role by name", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/name/editor`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("editor");
  });

  test("admin should update role by ID", async () => {
    const response = await request(app)
      .patch(`${BASE_URI}/${createdRoleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ description: "Updated editor role" });

    expect(response.status).toBe(200);
    expect(response.body.description).toBe("Updated editor role");
  });

  test("admin should delete role by ID", async () => {
    const response = await request(app)
      .delete(`${BASE_URI}/${createdRoleId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Role deleted successfully");
  });

  // Non-admin access should be forbidden
  describe("non-admin access to protected role routes", () => {
    test("non-admin should not fetch all roles", async () => {
      const response = await request(app)
        .get(`${BASE_URI}/`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test("non-admin should not fetch role by name", async () => {
      const response = await request(app)
        .get(`${BASE_URI}/name/editor`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test("non-admin should not fetch role by ID", async () => {
      const response = await request(app)
        .get(`${BASE_URI}/${createdRoleId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });

    test("non-admin should not create a new role", async () => {
      const response = await request(app)
        .post(`${BASE_URI}/`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ name: "unauthorized-role" });

      expect(response.status).toBe(403);
    });

    test("non-admin should not update role", async () => {
      const response = await request(app)
        .patch(`${BASE_URI}/${createdRoleId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ description: "should not work" });

      expect(response.status).toBe(403);
    });

    test("non-admin should not delete role", async () => {
      const response = await request(app)
        .delete(`${BASE_URI}/${createdRoleId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
    });
  });
});
