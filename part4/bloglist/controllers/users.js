const bcrypt = require('bcryptjs');

const usersRouter = require('express').Router();

const User = require('../models/user');

usersRouter.get('/api/users', async (request, response) => {
  try {
    const allUsers = (await User.find({})).map((user) => user.toJSON());
    response.json(allUsers);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error->', error);
    response.status(500).json(error);
  }
});

usersRouter.post('/api/users', async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;

  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
