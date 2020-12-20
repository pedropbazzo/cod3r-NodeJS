
exports.up = function createTableAccounts(knex) {
  return knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.integer('user_id').references('id').inTable('users').notNull();
  });
};

exports.down = function dropTableAccounts(knex) {
  return knex.schema.dropTable('accounts');
};
