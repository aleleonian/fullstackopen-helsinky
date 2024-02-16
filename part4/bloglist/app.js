const express = require('express');

const app = express();

const cors = require('cors');

const mongoose = require('mongoose');

const config = require('./utils/config');

const middleware = require('./utils/middleware');

const mongoUrl = config.MONGODB_URI;

const blogRouter = require('./controllers/blogpost');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
// app.use(middleware.userExtractor);
app.use('/api/blogposts', middleware.userExtractor, blogRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
