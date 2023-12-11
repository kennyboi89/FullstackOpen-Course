const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require('../utils/middleware');

const checkToken = (token) => {
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  return decodedToken;
};

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1 });
  response.json(blogs).end;
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  response.json(blog).end;
});

blogsRouter.post("/", middleware.userExtractor, async (request, response, next) => {
  const body = request.body;

  const decodedToken = checkToken(request.token);
  const user = await User.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", middleware.userExtractor, async (request, response, next) => {
  const decodedToken = checkToken(request.token);
  const blog = await Blog.findById(request.params.id);

  if (decodedToken.id != blog.user.toString()) {
    response.status(403).json({ error: "Permission denied" }).end();
  } else {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  }
});

blogsRouter.put("/:id", async (request, response, next) => {
  const body = request.body;

  const updateObject = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const update = await Blog.findByIdAndUpdate(request.params.id, updateObject);
  response.status(200).json(updateObject).end();
});

module.exports = blogsRouter;
