const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')

const mongoUrl = config.MONGODB_URI

console.log("mongoUrl->", mongoUrl);

const blogRouter = require('./controllers/blog');

mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use(blogRouter)

module.exports = app
