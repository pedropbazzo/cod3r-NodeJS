
exports.up = function createUsers(knex) {
  return knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('mail').notNull().unique();
    t.string('passwd').notNull();
  });
};

exports.down = function dropUsers(knex) {
  return knex.schema.dropTable('users');
};
