const supertest = require('supertest');

const server = require('../api/server');

const authRouter = require('../auth/auth-router');
const Users = require('../users/users-model');

const db = require('../database/dbConfig');

describe('router', function () {
  it('runs the tests', function () {
    expect(true).toBe(true);
  });

  describe('GET /', function () {
    it('should return JSON', async function () {
      await supertest(server)
        .get('/api/jokes')
        .then((res) => {
          expect(res.type).toBe('application/json');
          expect(res.type).toMatch(/json/i);
        });
    });

    it('should return id', async function () {
      await supertest(server)
        .get('/api/jokes')
        .then((res) => {
          expect(res.body.id);
        });
    });
  });

  describe('POST /', function () {
    it('should respond with 201 OK', async function () {
      await supertest(server)
        .post('/api/auth/register')
        .send({ username: 'new', password: 'test' })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });

    it('should not respond with 201 OK', async function () {
      await supertest(server)
        .post('/api/auth/register')
        .send({ username: 'testing', password: 'test' })
        .then((res) => {
          expect(res.status).not.toBe(201);
        });
    });

    it('should respond with 200 OK', async function () {
      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'testing', password: 'test' })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });

    it('should respond with 401 if credentials are not registered', async function () {
      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'wrong', password: 'wrong' })
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it('should respond with 401 if password is invalid', async function () {
      await supertest(server)
        .post('/api/auth/login')
        .send({ username: 'hello', password: 'wrong' })
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });
  });
});
