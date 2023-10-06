import { afterAll, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { app } from "./../src/app";
import { execSync } from "child_process";
import request from "supertest";

describe("User routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("shold be able create a new user", async () => {
    await request(app.server)
      .post("/users")
      .send({
        name: "New user",
        email: "email@exemple.com",
      })
      .expect(201);
  });

  it("shoul be abble list all users"),
    async () => {
      const createUserResponse = await request(app.server).post("/users").send({
        name: "New user",
        email: "email@exemple.com",
      });

      const listUsersResponse = await request(app.server)
        .get("/users")
        .expect(200);

      expect(listUsersResponse.body.users).toEqual([
        expect.objectContaining({
          name: "New user",
          email: "email@exemple.com",
        }),
      ]);
    };
});
