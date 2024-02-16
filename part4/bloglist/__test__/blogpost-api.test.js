/* eslint-disable no-undef */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = require('../utils/blog-api_helper');

const Blogpost = require('../models/blogpost');

const User = require('../models/user');

let initialLength;

const firstUser = {
  username: 'firstuser',
  name: 'First User',
  password: 'firstuser1234',
};

const secondUser = {
  username: 'seconduser',
  name: 'Second User',
  password: 'seconduser1234',
};

beforeAll(async () => {
  // empty the db of users
  await User.deleteMany({});

  // add new users
  const firstUserObj = await api
    .post('/api/users')
    .send(firstUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const secondUserObj = await api
    .post('/api/users')
    .send(secondUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  // store their id for later use
  firstUser.id = JSON.parse(firstUserObj.text).id;
  secondUser.id = JSON.parse(secondUserObj.text).id;

  // log those users in and store their auth token
  const firstUserAuthObj = await api
    .post('/api/login')
    .send({
      username: firstUser.username,
      password: firstUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  firstUser.token = JSON.parse(firstUserAuthObj.text).token;

  const secondUserAuthObj = await api
    .post('/api/login')
    .send({
      username: secondUser.username,
      password: secondUser.password,
    })
    .expect(200)
    .expect('Content-Type', /application\/json/);

  secondUser.token = JSON.parse(secondUserAuthObj.text).token;
});

// let's fill the db with blog posts
beforeEach(async () => {
  await Blogpost.deleteMany({});

  const blogpostObjects = helper.initialBlogPosts.map((bp) => new Blogpost(bp));

  const promiseArray = blogpostObjects.map((bp) => bp.save());

  await Promise.all(promiseArray);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogposts')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// test('correct amounts of blog posts', async () => {
//   const response = await api.get('/api/blogposts');

//   expect(response.body).toHaveLength(6);
// });

// test('verifies that the unique identifier property of the blog posts is named id,', async () => {
//   const response = await api.get('/api/blogposts');

//   expect(response.body[0].id).toBeDefined();
//   expect(response.body[0]._id).toBeFalsy();
// });

// test('a valid blog post can be added', async () => {
//   let response = await api.get('/api/blogposts');

//   initialLength = response.body.length;

//   const newBlogPost = {
//     title: 'Como hacer el puré perfecto',
//     author: 'Alejandro Leonian',
//     url: 'https://www.elcocinillas.com/pure-perfecto',
//     likes: 23,
//     __v: 0,
//   };

//   await api
//     .post('/api/blogposts')
//     .send(newBlogPost)
//     .expect(201)
//     .expect('Content-Type', /application\/json/);

//   response = await api.get('/api/blogposts');

//   expect(response.body).toHaveLength(initialLength + 1);

//   const contents = response.body.map((bp) => bp.title);

//   expect(contents).toContain(
//     'Como hacer el puré perfecto',
//   );
// });

// test('likes default to 0 if absent in post data', async () => {
//   let response = await api.get('/api/blogposts');

//   const newBlogPost = {
//     title: 'Default likes to 0',
//     author: 'Alejandro Leonian',
//     url: 'https://www.elcocinillas.com/pure-perfecto',
//   };

//   await api
//     .post('/api/blogposts')
//     .send(newBlogPost)
//     .expect(201)
//     .expect('Content-Type', /application\/json/);

//   response = await api.get('/api/blogposts');

//   const desiredPost = response.body.find((blogPost) => blogPost.title === 'Default likes to 0');

//   expect(desiredPost.likes).toBe(
//     0,
//   );
// });

// test('title or url cannot be missing', async () => {
//   const newBlogPost = {
//     author: 'Alejandro Leonian',
//   };

//   await api
//     .post('/api/blogposts')
//     .send(newBlogPost)
//     .expect(400);
// });

// test('can delete a document', async () => {
//   await api
//     .delete('/api/blogposts/5a422a851b54a676234d17f7')
//     .expect(204);

//   const response = await api.get('/api/blogposts');

//   expect(response.body).toHaveLength(initialLength - 1);
// });

afterAll(async () => {
  await mongoose.connection.close();
});
