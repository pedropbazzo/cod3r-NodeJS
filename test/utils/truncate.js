require('dotenv').config({
  path: '.test.env',
});
const KnexCleaner = require('knex-cleaner');
const Knex = require('../../src/config/db');

module.exports = async () => {
  await KnexCleaner.clean(Knex, {
    mode: 'truncate',
    restartIdentity: true,
  });

  await Knex.destroy();
};
