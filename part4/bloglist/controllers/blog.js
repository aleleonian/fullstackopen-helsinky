const mongoose = require('mongoose');

const blogRouter = require('express').Router();

const Blog = require('../models/blog');

blogRouter.get('/api/blogs', async (request, response) => {
  const blogPosts = await Blog.find({});
  response.json(blogPosts);
});

blogRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body);

  if (!blog.title || !blog.url) return response.status(400).end();

  if (!blog.likes) blog.likes = 0;

  const result = await blog.save();

  return response.status(201).json(result);
});

blogRouter.delete('/api/blogs/:id', async (request, response) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(request.params.id);

  let objectId;

  if (isValidObjectId) {
    objectId = new mongoose.Types.ObjectId(request.params.id);
  } else {
    // eslint-disable-next-line no-console
    console.error('Invalid ObjectId format');
    return response.status(400).end();
  }

  try {
    const deletedDocument = await Blog.findByIdAndDelete(objectId);

    if (deletedDocument) {
      // eslint-disable-next-line no-console
      console.log('Document deleted successfully:', deletedDocument);
    } else {
      // eslint-disable-next-line no-console
      console.log('Document not found');
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting document:', error);
  }

  return response.status(204).end();
});

blogRouter.put('/api/blogs/:id', async (request, response) => {
  const { body } = request.body;

  const blogPost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlogpost = await Blog.findByIdAndUpdate(
      request.params.id,
      blogPost,
      { new: true },
    );
    response.json(updatedBlogpost);
  } catch (error) {
    response.status(400).json(error);
    // eslint-disable-next-line no-console
    console.log(error);
  }
});
module.exports = blogRouter;