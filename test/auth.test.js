const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const insert = require('./utils/insert')(app);
const getFakeUser = require('./utils/getFakeUser');

describe('auth-related routes', () => {
  let user;

  beforeAll(async () => {
    user = getFakeUser();

    user.id = (await insert('users', user)).id;
  });

  describe('POST /login', () => {
    it('should returns a token when user exists', async () => {
      const response = await request(app)
        .post('/login')
        .send({ mail: user.mail, passwd: user.passwd });

      const { token } = response.body;

      expect(response.status).toBe(200);
      expect(token).not.toBeUndefined();
    });

    it('should returns encrypted id as token', async () => {
      const response = await request(app)
        .post('/login')
        .send({ mail: user.mail, passwd: user.passwd });

      const { token } = response.body;
      const decoded = jwt.verify(token, process.env.SECRET);
      expect(decoded.id).toBe(user.id);
    });

    it('should returns 404 when user not exists', async () => {
      const response = await request(app)
        .post('/login')
        .send({ mail: `${user.mail} it will fail`, passwd: user.passwd });

      const { error, token } = response.body;

      expect(response.status).toBe(404);
      expect(error).toBe('user not found');
      expect(token).toBeUndefined();
    });

    it('should returns 400 when passwd is wrong', async () => {
      const response = await request(app)
        .post('/login')
        .send({ mail: user.mail, passwd: `${user.passwd} it will fail` });

      const { error, token } = response.body;

      expect(response.status).toBe(400);
      expect(error).toBe('passwd invalid');
      expect(token).toBeUndefined();
    });
  });
});
