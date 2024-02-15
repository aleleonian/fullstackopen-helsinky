const mongoose = require('mongoose');

const blogRouter = require('express').Router();

const Blogpost = require('../models/blog');

const User = require('../models/user');

blogRouter.get('/api/blogposts', async (request, response) => {
  const blogPosts = await Blogpost.find({}).populate('user');
  response.json(blogPosts);
});

blogRouter.post('/api/blogposts', async (request, response) => {
  const user = await User.findById(request.body.userId);

  console.log('user->', user);

  const newBlogPost = request.body;

  // should not this be user._id?
  newBlogPost.user = user.id;

  const blog = new Blogpost(newBlogPost);

  if (!blog.title || !blog.url) return response.status(400).end();

  if (!blog.likes) blog.likes = 0;

  const savedBlogpost = await blog.save();

  user.blogposts = user.blogposts.concat(savedBlogpost._id);

  await user.save();

  return response.status(201).json(savedBlogpost);
});

blogRouter.delete('/api/blogposts/:id', async (request, response) => {
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
    const deletedDocument = await Blogpost.findByIdAndDelete(objectId);

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

blogRouter.put('/api/blogposts/:id', async (request, response) => {
  const { body } = request.body;

  const blogPost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlogpost = await Blogpost.findByIdAndUpdate(
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
