const request = require('supertest');
const app = require('../src/app');

describe('app component', () => {
  it('should response at /', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
  });
});
