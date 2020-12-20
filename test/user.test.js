const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../src/app');
const insert = require('./utils/insert')(app);
const selectInDB = require('./utils/selectInDB');
const getFakeUser = require('./utils/getFakeUser');

describe('user-related routes', () => {
  let user;

  beforeEach(() => {
    user = getFakeUser();
  });

  describe('POST /users', () => {
    it('should insert an user', async () => {
      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(201);
      expect(response.body[0]).toHaveProperty('name', user.name);
      expect(response.body[0]).not.toHaveProperty('passwd');
    });

    it('should encrypt passwd and not return this property', async () => {
      const { passwd: passwdWithoutHash } = user;

      const response = await request(app)
        .post('/users')
        .send(user);

      const { id } = response.body[0];
      const { passwd } = await selectInDB('users', id);
      expect(response.body[0]).not.toHaveProperty('passwd');
      expect(passwd).not.toBe(passwdWithoutHash);
      expect(await bcrypt.compare(passwdWithoutHash, passwd)).toBe(true);
    });

    it('should not insert an unnamed user', async () => {
      delete user.name;

      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'cannot to insert an user without name',
      );
    });

    it('should not insert an user without mail', async () => {
      delete user.mail;

      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'cannot to insert an user without mail',
      );
    });

    it('should not insert an user without passwd', async () => {
      delete user.passwd;

      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'cannot to insert an user without passwd',
      );
    });

    it('should not insert an user which mail already exists', async () => {
      await request(app)
        .post('/users')
        .send(user);

      const response = await request(app)
        .post('/users')
        .send(user);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'mail already exists');
    });
  });

  describe('GET /users', () => {
    it('should returns 401 if token is not provided', async () => {
      await insert('users', user);

      const response = await request(app).get('/users');
      const { error } = response.body;

      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(response.body.length).toBeUndefined();
    });

    it('should list all users', async () => {
      const { id } = await insert('users', user);
      const responseAuth = await request(app)
        .post('/login')
        .send({ mail: user.mail, passwd: user.passwd });

      const response = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${responseAuth.body.token}`);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.find((value) => value.id === id)).not.toBeUndefined();
    });
  });
});
