import { afterAll, beforeAll, beforeEach, describe, it, expect } from "vitest";
import { app } from "./../src/app";
import { execSync } from "child_process";
import request from "supertest";

describe("Meals routes", () => {
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

  it("shold be able to create a new meal", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);
  });

  it("shold be able to list meals", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);

    console.log(user_id);

    const listMealResponse = await request(app.server)
      .get(`/meals?user_id=${user_id}`)
      .expect(200);

    expect(listMealResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "New meal",
        description: "New description",
        user_id: user_id,
      }),
    ]);
  });

  it("shold be able to list specific meal", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);

    console.log(user_id);

    const listMealResponse = await request(app.server)
      .get(`/meals?user_id=${user_id}`)
      .expect(200);

    expect(listMealResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "New meal",
        description: "New description",
        user_id: user_id,
      }),
    ]);

    const meal_id = listMealResponse.body.meals[0].id;

    const listSpecificMealResponse = await request(app.server)
      .get(`/meals/${meal_id}`)
      .expect(200);

    expect(listSpecificMealResponse.body.meals).toEqual(
      expect.objectContaining({
        name: "New meal",
        description: "New description",
        user_id: user_id,
      })
    );
  });

  it("shold be able to delete meal", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);

    console.log(user_id);

    const listMealResponse = await request(app.server)
      .get(`/meals?user_id=${user_id}`)
      .expect(200);

    expect(listMealResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "New meal",
        description: "New description",
        user_id: user_id,
      }),
    ]);

    const meal_id = listMealResponse.body.meals[0].id;

    await request(app.server).delete(`/meals/${meal_id}`).expect(200);
  });

  it("shold be able to update meal", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);

    console.log(user_id);

    const listMealResponse = await request(app.server)
      .get(`/meals?user_id=${user_id}`)
      .expect(200);

    expect(listMealResponse.body.meals).toEqual([
      expect.objectContaining({
        name: "New meal",
        description: "New description",
        user_id: user_id,
      }),
    ]);

    const meal_id = listMealResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${meal_id}`)
      .send({
        name: "New meal 2",
        description: "New description 2",
        is_diet: true,
      })
      .expect(200);
  });

  it("shold be able to list summary", async () => {
    await request(app.server).post("/users").send({
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

    const user_id = listUsersResponse.body.users[0].id;

    await request(app.server)
      .post("/meals")
      .send({
        name: "New meal",
        description: "New description",
        is_diet: false,
        user_id: user_id,
      })
      .expect(201);

    console.log(user_id);

    const summaryResponse = await request(app.server)
      .get(`/meals/summary?user_id=${user_id}`)
      .expect(200);
  });
});
