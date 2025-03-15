import request from "supertest";
import app from "../../app";

describe("Auth Controller", () => {
    const validUser = {
        first_name: "Spiderchip",
        last_name: "User",
        email: "user@spiderchip.com",
        password: "TestPassword123!",
    };

    describe("User Registration Test Suit", () => {
        it("should register a new user and return user details", async () => {
            console.log(validUser);
            const res = await request(app)
                .post("/api/auth/register")
                .send(validUser);

            console.log(res.body);

            expect(res.body).toHaveProperty("id");
        });

        it("should return 400 if first_name is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, first_name: "" })
                .expect(400);
        
            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("First name is required");
        });
        
        it("should return 400 if last_name is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, last_name: "" })
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Last name is required");
        });

        it("should return 400 if email is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, email: "" })
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Email is required");
        });
        
        it("should return 400 if email format is invalid", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, email: "invalid-email" })
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Invalid email format");
        });

        it("should return 400 if password is missing", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, password: "" })
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Password is required");
        });
        
        it("should return 400 if password is too short", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, password: "Pass12" }) // 6 characters only
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Password must be at least 8 characters long");
        });

        it("should return 400 if password does not contain an uppercase letter", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, password: "password123" }) // No uppercase
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Password must contain at least one uppercase letter and one number");
        });
        
        it("should return 400 if password does not contain a number", async () => {
            const res = await request(app)
                .post("/api/auth/register")
                .send({ ...validUser, password: "PasswordOnly" }) // No number
                .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Password must contain at least one uppercase letter and one number");
        });
    });

    describe("User Login Test Suite", () => {
        beforeAll(async () => {
            // Register user before running login tests
            await request(app).post("/api/auth/register").send(validUser);
        });

        it("should login an existing user and return a token", async () => {
            const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email, password: validUser.password })
            .expect(200);

            expect(res.body).toHaveProperty("token");
        });

        it("should return 400 if email is missing", async () => {
            const res = await request(app)
            .post("/api/auth/login")
            .send({ password: validUser.password })
            .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Email is required");
        });

        it("should return 400 if password is missing", async () => {
            const res = await request(app)
            .post("/api/auth/login")
            .send({ email: validUser.email })
            .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Password is required");
        });

        it("should return 401 for invalid credentials", async () => {
            const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "invalid@example.com", password: "wrongpass" })
            .expect(400);

            expect(res.body).toHaveProperty("errors");
            expect(res.body.errors).toContain("Invalid email or password");
        });
    });

});
