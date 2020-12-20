require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.test.env',
});
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
app.get('/', (req, res) => res.sendStatus(200));
app.use('/', userRoutes);
app.use('/', accountRoutes);
app.use('/', authRoutes);
app.use(errorHandler);

module.exports = app;
