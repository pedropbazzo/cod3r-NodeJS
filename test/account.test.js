const request = require('supertest');
const app = require('../src/app');
const insert = require('./utils/insert')(app);
const selectInDB = require('./utils/selectInDB');
const getFakeUser = require('./utils/getFakeUser');
const getFakeAccount = require('./utils/getFakeAccount');

describe('account-related routes', () => {
  let user;
  let user2;
  let token;
  let token2;
  let account;
  let account2;

  beforeAll(async () => {
    user = getFakeUser();
    user2 = getFakeUser();
    const users = await Promise.all([
      insert('users', user),
      insert('users', user2),
    ]);
    user.id = users[0].id;
    user2.id = users[1].id;

    const [responseAuth, responseAuth2] = await Promise.all([
      request(app)
        .post('/login')
        .send({ mail: user.mail, passwd: user.passwd }),
      request(app)
        .post('/login')
        .send({ mail: user2.mail, passwd: user2.passwd }),
    ]);

    token = `Bearer ${responseAuth.body.token}`;
    token2 = `Bearer ${responseAuth2.body.token}`;
  });

  beforeEach(() => {
    account = getFakeAccount();
    account2 = getFakeAccount();
  });

  describe('POST /accounts', () => {
    it('should returns 401 if token is not provided', async () => {
      const response = await request(app)
        .post('/accounts')
        .send(account);

      const { error } = response.body;
      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(response.body.length).toBeUndefined();
    });

    it('should insert an account', async () => {
      const response = await request(app)
        .post('/accounts')
        .set('Authorization', token)
        .send(account);

      expect(response.status).toBe(201);
      expect(response.body[0]).toHaveProperty('name', account.name);
    });

    it('should not insert two accounts with the same name for the same user', async () => {
      await request(app)
        .post('/accounts')
        .set('Authorization', token)
        .send(account);

      const response = await request(app)
        .post('/accounts')
        .set('Authorization', token)
        .send(account);

      const { error } = response.body;
      expect(response.status).toBe(400);
      expect(error).toBe('name already exists');
    });
  });

  describe('GET /accounts', () => {
    it('should returns 401 if token is not provided', async () => {
      await insert('accounts', account, token);

      const response = await request(app).get('/accounts');

      const { error } = response.body;
      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(response.body.length).toBeUndefined();
    });

    it('should list all accounts of one user', async () => {
      await Promise.all([
        insert('accounts', account, token),
        insert('accounts', account2, token2),
      ]);

      const response = await request(app)
        .get('/accounts')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.every((item) => item.user_id === user.id)).toBe(true);
    });
  });

  describe('GET /accounts/:id', () => {
    it('should returns 401 if token is not provided', async () => {
      const accountDB = await insert('accounts', account, token);

      const response = await request(app).get(`/accounts/${accountDB.id}`);

      const { error } = response.body;
      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(response.body.length).toBeUndefined();
    });

    it('should find an account by id', async () => {
      const accountDB = await insert('accounts', account, token);

      const response = await request(app)
        .get(`/accounts/${accountDB.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toEqual(accountDB);
    });

    it('should return 404 when account not exists', async () => {
      const id = 10000000;

      const response = await request(app)
        .get(`/accounts/${id}`)
        .set('Authorization', token);

      expect(response.status).toBe(404);
    });

    it('should not return anothers user account', async () => {
      const account2DB = await insert('accounts', account2, token2);

      const response = await request(app)
        .get(`/accounts/${account2DB.id}`)
        .set('Authorization', token);

      const { error } = response.body;
      expect(response.status).toBe(403);
      expect(error).toBe('this account is not yours');
      expect(response.body.length).toBeUndefined();
    });
  });

  describe('PUT /accounts/:id', () => {
    it('should returns 401 if token is not provided', async () => {
      const accountDB = await insert('accounts', account, token);
      const url = `/accounts/${accountDB.id}`;
      const oldName = accountDB.name;
      accountDB.name += new Date().getMilliseconds().toString();

      const response = await request(app)
        .put(url)
        .send(accountDB);

      const accountDBNotModified = (
        await request(app)
          .get(url)
          .set('Authorization', token)
      ).body[0];

      const { error } = response.body;
      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(accountDBNotModified.name).toBe(oldName);
    });

    it("should update account's name", async () => {
      const accountDB = await insert('accounts', account, token);
      const url = `/accounts/${accountDB.id}`;
      accountDB.name += new Date().getMilliseconds().toString();

      const response = await request(app)
        .put(url)
        .send(accountDB)
        .set('Authorization', token);

      const accountDBModified = (
        await request(app)
          .get(url)
          .set('Authorization', token)
      ).body[0];

      expect(response.status).toBe(204);
      expect(accountDBModified.name).toBe(accountDB.name);
    });

    it('should not update anothers user account', async () => {
      const accountDB = await insert('accounts', account2, token2);
      const url = `/accounts/${accountDB.id}`;
      accountDB.name += new Date().getMilliseconds().toString();

      const response = await request(app)
        .put(url)
        .send(accountDB)
        .set('Authorization', token);

      const accountDBNotModified = await selectInDB('accounts', accountDB.id);

      const { error } = response.body;
      expect(response.status).toBe(403);
      expect(error).toBe('this account is not yours');
      expect(accountDBNotModified.name).toBe(account2.name);
    });
  });

  describe('DELETE /accounts/:id', () => {
    it('should returns 401 if token is not provided', async () => {
      const { id } = await insert('accounts', account, token);
      const url = `/accounts/${id}`;

      const response = await request(app).delete(url);

      const accountNotDeleted = await request(app)
        .get(url)
        .set('Authorization', token);

      const { error } = response.body;
      expect(response.status).toBe(401);
      expect(error).toBe('protected resource');
      expect(accountNotDeleted.status).toBe(200);
      expect(accountNotDeleted.body[0].id).toBe(id);
    });

    it('should delete an account', async () => {
      const { id } = await insert('accounts', account, token);
      const url = `/accounts/${id}`;

      const response = await request(app)
        .delete(url)
        .set('Authorization', token);

      const accountDeleted = await request(app)
        .get(url)
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(accountDeleted.status).toBe(404);
    });

    it('should not delete anothers user account', async () => {
      const { id } = await insert('accounts', account2, token2);
      const url = `/accounts/${id}`;

      const response = await request(app)
        .delete(url)
        .set('Authorization', token);

      const accountNotDeleted = await selectInDB('accounts', id);

      const { error } = response.body;
      expect(response.status).toBe(403);
      expect(error).toBe('this account is not yours');
      expect(accountNotDeleted.name).toBe(account2.name);
    });
  });
});
