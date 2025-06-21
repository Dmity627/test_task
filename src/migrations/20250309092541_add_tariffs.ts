import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("tariffs", (table) => {
    table.increments("id").primary();
    table.date("date");
    table.float("kgvpMarketplace");
    table.float("kgvpSupplier");
    table.float("kgvpSupplierExpress");
    table.float("paidStorageKgvp");
    table.integer("parentID");
    table.string("parentName");
    table.integer("subjectID");
    table.string("subjectName");

    table.unique(["date", "parentID", "subjectID"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("tariffs");
}
