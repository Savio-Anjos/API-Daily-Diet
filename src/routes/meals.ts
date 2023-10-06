import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { boolean, z } from "zod";
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
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamsSchema.parse(request.params);

    const meals = await knex("meals").where({ id }).first();

    return { meals };
  });

  app.put("/:id", async (request, reply) => {
    const getSnackParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const getSnackBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      is_diet: z.boolean(),
    });

    const { id } = getSnackParamsSchema.parse(request.params);

    const existingMeal = await knex("meals").where({ id }).first();

    if (!existingMeal) {
      return reply.status(404).send("Refeição não encontrada.");
    }

    const { name, description, is_diet } = getSnackBodySchema.parse(
      request.body
    );

    const updatedFields: {
      name: string;
      description: string;
      is_diet: boolean;
    } = {
      name: "",
      description: "",
      is_diet: false,
    };

    if (name !== undefined) {
      updatedFields.name = name;
    }

    if (description !== undefined) {
      updatedFields.description = description;
    }

    if (is_diet !== undefined) {
      updatedFields.is_diet = is_diet;
    }

    await knex("meals").where({ id }).update(updatedFields);

    return reply.status(200).send("Meal updated successfully");
  });

  app.delete("/:id", async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getMealParamsSchema.parse(request.params);

    const deletedMeal = await knex("meals").where({ id }).del();

    if (deletedMeal === 0) {
      return reply.status(404).send("Meal not found.");
    }

    return reply.status(200).send("Meal deleted successfully.");
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
