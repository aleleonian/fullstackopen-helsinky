const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

blogRouter.get("/api/blogs", async (request, response) => {
  const blogPosts = await Blog.find({});
  response.json(blogPosts);
});

blogRouter.post("/api/blogs", async (request, response) => {
  const blog = new Blog(request.body);

  if (!blog.title || !blog.url) return response.status(400).end();

  if (!blog.likes) blog.likes = 0;

  const result = await blog.save();

  response.status(201).json(result);
});

blogRouter.delete("/api/blogs/:id", async (request, response) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(request.params.id);

  let objectId;

  if (isValidObjectId) {
    objectId = new ObjectId(request.params.id);
  } else {
    console.error("Invalid ObjectId format");
    return response.status(400).end();
  }

  try {
    const deletedDocument = await Blog.findByIdAndDelete(objectId);

    if (deletedDocument) {
      console.log("Document deleted successfully:", deletedDocument);
    } else {
      console.log("Document not found");
    }
  } catch (error) {
    console.error("Error deleting document:", error);
  }

  response.status(204).end();
});

blogRouter.put("/api/blogs/:id", (request, response, next) => {
    
  const body = request.body;

  const blogPost = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  Blog.findByIdAndUpdate(request.params.id, blogPost, { new: true })
    .then((updatedBlogpost) => {
      response.json(updatedBlogpost);
    })
    .catch((error) => next(error));
});
module.exports = blogRouter;
