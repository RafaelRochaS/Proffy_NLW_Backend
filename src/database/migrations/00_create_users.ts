import Knex from "knex";

export async function up(knex: Knex) {      // Quais atualizações a realizar
    return knex.schema.createTable("users", table => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("avatar").notNullable();
        table.string("whatsapp").notNullable();
        table.string("bio").notNullable();
    });
}

export async function down(knex: Knex) {    // Rollback
    return knex.schema.dropTable("users");
}