const request = require('supertest');

module.exports = (app) => async (table, data, token = '') => {
  const result = (
    await request(app)
      .post(`/${table}`)
      .set('Authorization', token)
      .send(data)
  ).body[0];
  return result;
};
