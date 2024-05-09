/* eslint-disable no-underscore-dangle */
const testingRouter = require('express').Router();

const Blogpost = require('../models/blogpost');

const User = require('../models/user');

testingRouter.post('/reset', async (request, response, next) => {
  try {
    await Blogpost.deleteMany({});
    await User.deleteMany({});
    response.status(200).send("ALL GOOD");
  } catch (error) {
    next(error);
    console.log('Error in /reset');
  }
});

// testingRouter.post('/initdb', async (request, response, next) => {
//   try {
//     await Blogpost.deleteMany({});
//     await User.deleteMany({});
//     response.status(200).send("ALL GOOD");
//   } catch (error) {
//     next(error);
//     console.log('Error in /reset');
//   }
// });

module.exports = testingRouter;
