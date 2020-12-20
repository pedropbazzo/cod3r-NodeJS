const knex = require('../../src/config/db');

module.exports = async (table, id) => (await knex(table).select().where({ id }))[0];
