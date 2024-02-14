/* eslint-disable no-undef */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

// const User = require('../models/user');

describe('Invalid user creation', () => {
  test('Invalid password', async () => {
    const newUser = {
      username: 'aleleonian',
      name: 'alejandro',
      password: '22',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.error).toBe('Password must be at least 7 chars long.');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
