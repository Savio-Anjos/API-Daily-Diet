import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function mealsRoutes(app: FastifyInstance) {
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
