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

describe("Auth Routes", () => {
  const testUser = {
    name: "Test User",
    username: "testuser",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    test("should register user and return token", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", testUser.name);
      expect(res.body).toHaveProperty("username", testUser.username);
      expect(res.body).toHaveProperty("token");

      // Verify user created in DB
      const user = await User.findOne({ username: testUser.username });
      expect(user).toBeTruthy();
      expect(user.password).not.toBe(testUser.password); // Password hashed
    });

    test("should reject duplicate username", async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message.toLowerCase()).toContain("username");
    });

    test("should reject missing fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ name: "Test" }); // missing username and password

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    test("should login with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: testUser.username,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.username).toBe(testUser.username);
    });

    test("should reject invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: testUser.username,
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(401);
    });

    test("should reject non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          username: "nonexistent",
          password: "somepassword",
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("JWT Token", () => {
    test("generated token should contain user id", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      const jwt = await import("jsonwebtoken");
      const decoded = jwt.default.verify(res.body.token, process.env.JWT_SECRET);

      expect(decoded).toHaveProperty("id");
      expect(decoded.id).toBe(res.body._id);
    });
  });
});