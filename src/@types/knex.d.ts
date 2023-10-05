import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      name: string;
      email: number;
      created_at: string;
      section_id?: string;
    };
  }
}
