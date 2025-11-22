import request from "supertest";
import app from "../../app.js";
import { connectDB, clearDB, closeDB } from "../setupDB.js";
import User from "../../models/userModel.js";

beforeAll(async () => {
  process.env.JWT_SECRET = "testsecret123";
  await connectDB();
});

afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe("Auth Routes - Register & Login", () => {
  const registerData = {
    name: "Test User",
    username: "testuser",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    test("should register user and return token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(registerData)
        .set("Accept", "application/json");

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", registerData.name);
      expect(res.body).toHaveProperty("username", registerData.username);
      expect(res.body).toHaveProperty("token");
      expect(typeof res.body.token).toBe("string");
      expect(res.body.token.length).toBeGreaterThan(0);

      // Verify user was actually created in DB
      const user = await User.findOne({ username: registerData.username });
      expect(user).toBeTruthy();
      expect(user.name).toBe(registerData.name);
    });

    test("should return 400 when username is taken", async () => {
      // Register first user
      await request(app).post("/api/auth/register").send(registerData);

      // Try to register with same username
      const res2 = await request(app)
        .post("/api/auth/register")
        .send(registerData);

      expect(res2.statusCode).toBe(400);
      expect(res2.body).toHaveProperty("message");
      expect(res2.body.message.toLowerCase()).toContain("username");
    });

    test("should return 400 when fields are missing", async () => {
      const testCases = [
        { name: "Test", username: "test" }, // missing password
        { name: "Test", password: "pass123" }, // missing username
        { username: "test", password: "pass123" }, // missing name
        {}, // all missing
      ];

      for (const testData of testCases) {
        const res = await request(app)
          .post("/api/auth/register")
          .send(testData);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message");
      }
    });

    test("should hash password in database", async () => {
      await request(app).post("/api/auth/register").send(registerData);

      const user = await User.findOne({ username: registerData.username });
      expect(user.password).not.toBe(registerData.password);
      expect(user.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a user before each login test
      await request(app).post("/api/auth/register").send(registerData);
    });

    test("should login with valid credentials and return token", async () => {
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          username: registerData.username,
          password: registerData.password,
        });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty("_id");
      expect(loginRes.body).toHaveProperty("name", registerData.name);
      expect(loginRes.body).toHaveProperty("username", registerData.username);
      expect(loginRes.body).toHaveProperty("token");
      expect(typeof loginRes.body.token).toBe("string");
    });

    test("should return 401 with invalid password", async () => {
      const badLogin = await request(app)
        .post("/api/auth/login")
        .send({
          username: registerData.username,
          password: "wrongpassword",
        });

      expect(badLogin.statusCode).toBe(401);
      expect(badLogin.body).toHaveProperty("message");
      expect(badLogin.body.message.toLowerCase()).toMatch(/invalid/);
    });

    test("should return 401 with non-existing user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "nonexistentuser",
          password: "somepassword",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message.toLowerCase()).toMatch(/invalid/);
    });

    test("should return 401 with missing credentials", async () => {
      const testCases = [
        { username: registerData.username }, // missing password
        { password: registerData.password }, // missing username
        {}, // both missing
      ];

      for (const testData of testCases) {
        const res = await request(app).post("/api/auth/login").send(testData);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty("message");
      }
    });

    test("should generate different tokens for different login sessions", async () => {
      const login1 = await request(app)
        .post("/api/auth/login")
        .send({
          username: registerData.username,
          password: registerData.password,
        });

      // Small delay to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const login2 = await request(app)
        .post("/api/auth/login")
        .send({
          username: registerData.username,
          password: registerData.password,
        });

      expect(login1.body.token).toBeTruthy();
      expect(login2.body.token).toBeTruthy();
    });
  });

  describe("JWT Token Validation", () => {
    test("generated token should contain user id", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send(registerData);

      const token = registerRes.body.token;
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty("id");
      expect(decoded.id).toBe(registerRes.body._id);
    });

    test("token should have expiration", async () => {
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send(registerData);

      const token = registerRes.body.token;
      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty("exp");
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });
});