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

  test('Empty username', async () => {
    const newUser = {
      username: '',
      name: 'thenameoftheperson',
      password: 'thelongpassword',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toMatch(/`username` is required./);
  });

  test('Short username', async () => {
    const newUser = {
      username: 'he',
      name: 'thenameoftheperson',
      password: 'thelongpassword',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toMatch(/is shorter than the minimum allowed length/);
  });
  test('Short name', async () => {
    const newUser = {
      username: 'theusername',
      name: 'aa',
      password: 'thelongpassword',
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(response.body.message).toMatch(/name: Path `name` \((.*?)\) is shorter than the minimum allowed length \(\d+\)\.$/);
  });
});

test('Empty name', async () => {
  const newUser = {
    username: 'theusername',
    name: '',
    password: 'thelongpassword',
  };

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(response.body.message).toMatch(/`name` is required./);
});

afterAll(async () => {
  await mongoose.connection.close();
});
