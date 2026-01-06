process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Auth routes', () => {
  test('GET / responds ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  describe('POST /api/auth/register', () => {
    test('missing fields returns 400', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });

    test('existing user returns 409', async () => {
      User.findOne = jest.fn().mockResolvedValue({ email: 'a@b.com' });
      const res = await request(app).post('/api/auth/register').send({ fullName: 'n', email: 'a@b.com', password: 'p' });
      expect(res.status).toBe(409);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    });

    test('creates user and returns 201', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed-pwd');
      User.prototype.save = jest.fn().mockResolvedValue();
      const res = await request(app).post('/api/auth/register').send({ fullName: 'n', email: 'c@d.com', password: 'p' });
      expect(res.status).toBe(201);
      expect(User.findOne).toHaveBeenCalledWith({ email: 'c@d.com' });
      expect(User.prototype.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    test('missing fields returns 400', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'a@b.com' });
      expect(res.status).toBe(400);
    });

    test('invalid credentials when no user returns 401', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);
      const res = await request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'p' });
      expect(res.status).toBe(401);
    });

    test('invalid credentials when password mismatch returns 401', async () => {
      User.findOne = jest.fn().mockResolvedValue({ password: 'hashed', _id: 'id', role: 'user' });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'p' });
      expect(res.status).toBe(401);
    });

    test('successful login returns token', async () => {
      User.findOne = jest.fn().mockResolvedValue({ password: 'hashed', _id: 'id', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');
      const res = await request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'p' });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token', 'jwt-token');
    });
  });
});
