const mongoose = require('mongoose');

const blogRouter = require('express').Router();

// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const Blogpost = require('../models/blogpost');

const User = require('../models/user');

blogRouter.get('/api/blogposts', async (request, response) => {
  const blogPosts = await Blogpost.find({}).populate('user');
  response.json(blogPosts);
});

blogRouter.post('/api/blogposts', async (request, response) => {
  let decodedToken;
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  const newBlogPost = request.body;

  // should not this be user._id?
  newBlogPost.user = user.id;

  const blog = new Blogpost(newBlogPost);

  if (!blog.title || !blog.url) return response.status(400).end();

  if (!blog.likes) blog.likes = 0;

  const savedBlogpost = await blog.save();

  user.blogposts = user.blogposts.concat(savedBlogpost._id);

  try {
    await user.save();

    return response.status(201).json(savedBlogpost);
  } catch (error) {
    return response.status(401).json({ error });
  }
});

blogRouter.delete('/api/blogposts/:id', async (request, response) => {
  if (!request.userId) {
    return response.status(401).json({ error: 'token invalid' });
  }

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
      return response.status(401).json({ error: 'Documents can only be deleted by owners.' });
    }
  } catch (error) {
    return response.status(401).send(`Error deleting document:${error.message}`);
  }

  return response.status(204).json('document deleted successfully!');
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
