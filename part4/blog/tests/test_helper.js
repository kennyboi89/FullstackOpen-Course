const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "How to develop fast",
    author: "Ken Nguyen",
    url: "www.blog.dev.faster",
    likes: 3,
    user: "65764d67a23677843b765042"
  },
  {
    title: "How to develop faster",
    author: "Ken Nguyen",
    url: "www.blog.dev.faster",
    likes: 5,
  },
];

const nonExistingId = async () => {
  const note = new Blog({ content: "willremovethissoon" });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
