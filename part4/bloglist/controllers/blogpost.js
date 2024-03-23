/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const blogRouter = require('express').Router();

const Blogpost = require('../models/blogpost');

const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogPosts = await Blogpost.find({}).populate('user');
  response.json(blogPosts);
});

blogRouter.post('/', async (request, response, next) => {
  const user = await User.findById(request.userId);

  const newBlogPost = request.body;

  // should not this be user._id?
  newBlogPost.user = user.id;

  const blog = new Blogpost(newBlogPost);

  if (!blog.likes) blog.likes = 0;
  let savedBlogpost;
  try {
    savedBlogpost = await blog.save();
    user.blogposts = user.blogposts.concat(savedBlogpost._id);
  } catch (error) {
    return next(error);
  }
  try {
    await user.save();
    return response.status(201).json(savedBlogpost);
  } catch (error) {
    return next(error);
  }
});

blogRouter.delete('/:id', async (request, response) => {
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
    const desiredBlogpost = await Blogpost.findById(objectId);

    if (desiredBlogpost.user.toString() === request.userId) {
      const deletedDocument = await Blogpost.findByIdAndDelete(objectId);

      if (deletedDocument) {
        // eslint-disable-next-line no-console
        console.log('Document deleted successfully:', deletedDocument);
      } else {
        // eslint-disable-next-line no-console
        console.log('Document not found');
      }
    } else {
      return response
        .status(401)
        .json({ error: 'Documents can only be deleted by owners.' });
    }
  } catch (error) {
    return response
      .status(401)
      .send(`Error deleting document:${error.message}`);
  }

  return response.status(204).json('document deleted successfully!');
});

blogRouter.put('/:id', async (request, response, next) => {
  const { body } = request;

  console.log('body->', JSON.stringify(body));

  const blogPost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes + 1,
  };

  try {
    const updatedBlogpost = await Blogpost.findByIdAndUpdate(
      request.params.id,
      blogPost,
      { new: true },
    );
    response.json(updatedBlogpost);
  } catch (error) {
    next(error);
    // eslint-disable-next-line no-console
    console.log(error);
  }
});

module.exports = blogRouter;
