import Knex from 'knex';

export async function up(knex: Knex){
    // CRIAR TABELA
    return knex.schema.createTable('points_itens', table => {
        table.increments('id').primary();
        table.integer('point_id')
        .notNullable()
        .references('id')
        .inTable('points');

        table.integer('item_id')
        .notNullable()
        .references('id')
        .inTable('itens');;
    });
}

export async function down(knex: Knex){
    // DELETAR TABELA
    return knex.schema.dropTable('points_itens');

}