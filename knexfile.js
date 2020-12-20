require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.test.env',
});

module.exports = {
  client: 'pg',
  version: '11.5',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
    directory: 'src/migrations',
  },
};
