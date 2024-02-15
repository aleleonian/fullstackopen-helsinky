const express = require('express');

const app = express();

const cors = require('cors');

const mongoose = require('mongoose');

const config = require('./utils/config');

const mongoUrl = config.MONGODB_URI;

const blogRouter = require('./controllers/blogpost');
const usersRouter = require('./controllers/users');

mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.use(blogRouter);
app.use(usersRouter);

module.exports = app;
