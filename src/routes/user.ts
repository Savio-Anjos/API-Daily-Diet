import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function userRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const users = await knex("users").select();

    return {
      users,
    };
  });

  app.post("/", async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    });

    const { name, email } = createUserBodySchema.parse(request.body);

    await knex("users").insert({
      id: randomUUID(),
      name,
      email,
      created_at: new Date().toISOString(),
    });

    return reply.status(201).send();
  });
}
