import request from "supertest";
import app from "../../app";
import { createTestUser, createAdminUser } from "../../test/repositories";
import { getPrisma } from "../../config/db";
import { loginUser } from "../../services/authService";
import { UserRequest, UserResponse, User } from "../../models/User";

describe("User Route Tests", () => {
  let testUser: UserRequest;
  let adminUser: UserRequest;
  let userToken: string;
  let adminToken: string;
  let createdUserId: string;
  const BASE_URI = "/api/user";

  beforeAll(async () => {
    testUser = await createTestUser();
    adminUser = await createAdminUser();

    const userLogin: UserResponse = await loginUser({
      email: testUser.email,
      password: testUser.password,
    }) as UserResponse;

    const adminLogin: UserResponse = await loginUser({
      email: adminUser.email,
      password: adminUser.password,
    }) as UserResponse;

    userToken = userLogin.token;
    adminToken = adminLogin.token;
  });

  afterAll(async () => {
    const prisma = await getPrisma();
    await prisma.users.deleteMany();
    await prisma.roles.deleteMany();
  });

  test("should allow admin to fetch all users", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("email");
  });

  test("should deny fetching all users if not admin", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });

  test("should return current user", async () => {
    const response = await request(app)
      .get(`${BASE_URI}/current`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("email", testUser.email);
  });

  test("should update current user", async () => {
    const updatedUsername = "updatedUsername";
    const response = await request(app)
      .patch(`${BASE_URI}/`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: updatedUsername });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(updatedUsername);
  });

  test("should get user by email (public route)", async () => {
    const response = await request(app).get(`${BASE_URI}/email/${testUser.email}`);
    expect(response.status).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });

  test("should allow admin to delete a user", async () => {
    // Register a new user to delete
    const newUser: UserRequest = {
      username: "tobedeleted",
      email: "tobedeleted@spiderchip.com",
      password: "ToBeDeleted123",
    };

    const registerRes = await request(app).post(`${BASE_URI}/register`).send(newUser);
    expect(registerRes.status).toBe(201);

    const prisma = await getPrisma();
    const createdUser: User | null = await prisma.users.findUnique({
      where: { email: newUser.email },
    });

    expect(createdUser).not.toBeNull();
    createdUserId = createdUser!.id;

    const deleteRes = await request(app)
      .delete(`${BASE_URI}/${createdUserId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(deleteRes.status).toBe(204);
  });

  test("should deny deletion for non-admin users", async () => {
    const prisma = await getPrisma();
    const userToDelete = await prisma.users.findFirst({
      where: { email: adminUser.email },
    });

    const response = await request(app)
      .delete(`${BASE_URI}/${userToDelete!.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(403);
  });
});
