import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function mealsRoutes(app: FastifyInstance) {
  app.get("/", async (request: any, reply) => {
    const user_id = request.query.user_id as string;

    const user = await knex("users").where("id", user_id).select();

    if (user.length === 0) {
      return reply.status(400).send("User does not exist!");
    }

    if (!user_id) {
      return reply.status(400).send("'user_id' parameter is mandatory.");
    }

    const meals = await knex("meals").where("user_id", user_id).select();

    return {
      meals,
    };
  });

  app.get("/:id", async (request, reply) => {
    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getSnackParamsSchema.parse(request.params);

    const meals = await knex("meals").where({ id }).first();

    return { meals };
  });

  app.post("/", async (request, reply) => {
    const createMealsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
      user_id: z.string(),
    });

    const { name, description, is_diet, user_id } = createMealsBodySchema.parse(
      request.body
    );

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      is_diet,
      user_id,
    });

    return reply.status(201).send();
  });
}
