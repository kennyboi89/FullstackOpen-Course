const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

let token = "";
beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const newUser = {
    username: "mluukkai",
    name: "Matti Luukkainen",
    password: "salainen",
  };

  const createdUser = await api.post("/api/users").send(newUser);

  const loginToken = await api
    .post("/api/login")
    .send({ username: newUser.username, password: newUser.password });

  token = loginToken.body.token;

  const user = createdUser.body.id;

  const blogs = helper.initialBlogs.map((blog) => new Blog({...blog, user}));
  const promiseArray = blogs.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "How to develop fastest",
    author: "Ken Nguyen",
    url: "www.blog.dev.faster",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogs = await helper.blogsInDb();
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogs.map((t) => t.title);
  expect(titles).toContain("How to develop fastest");
});

test("blog without title or url returns bad request", async () => {
  const newBlog = {
    author: "Ken Nguyen",
    likes: 3,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const blogs = await helper.blogsInDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test("blogs should have id fields", async () => {
  const blogs = await helper.blogsInDb();

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
    //expect(blog.id).toBeInstanceOf(mongoose.Types.ObjectId);
  });
});

test("blog should have default to 0 if no likes in the request", async () => {
  const newBlog = {
    title: "No likes in this blogpost",
    author: "Ken Nguyen",
    url: "www.blog.dev.faster",
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201);

  const blogs = await helper.blogsInDb();

  const titles = blogs.map((t) => t.title);
  expect(titles).toContain("No likes in this blogpost");
  const addedBlog = blogs.find(
    (blog) => blog.title === "No likes in this blogpost"
  );
  expect(addedBlog.likes).toBe(0);
});

describe("deletion of blog", () => {
  test("blog should not be able to delete if not authorized", async () => {
    let blogs = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .send()
      .expect(401);
  });

  test("blog should not be able to delete if wrong user", async () => {
    let blogs = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set("Authorization", `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI2NTc2NTE5NmU3NDI5ZGU3MzFhYjdhNTAiLCJpYXQiOjE3MDIyNTI5NTAsImV4cCI6MTcwMjI1NjU1MH0.21RG1rrNvjNvNeAiIX24Oa8nwb2305nk91NU6dcgUdY`)
      .send()
      .expect(403);
  });

  test("blog should be able to delete by id if author", async () => {
    let blogs = await helper.blogsInDb();
    await api
      .delete(`/api/blogs/${blogs[0].id}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect(204);
    blogs = await helper.blogsInDb();
    expect(blogs).toHaveLength(helper.initialBlogs.length - 1);
  });
});

describe("updating of note", () => {
  test("blog should be able to update likes by id", async () => {
    const updatedBlog = {
      title: "How to develop fast",
      author: "Ken Nguyen",
      url: "www.blog.dev.faster",
      likes: 100,
    };

    let blogs = await helper.blogsInDb();
    const response = await api
      .put(`/api/blogs/${blogs[0].id}`)
      .send(updatedBlog)
      .expect(200);
    expect(blogs).toHaveLength(helper.initialBlogs.length);
    const updatedBlogData = response.body;

    expect(updatedBlogData.likes).toBe(100);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
