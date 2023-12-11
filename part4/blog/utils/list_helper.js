var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  const sumWithInitial = blogs.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.likes;
  }, initialValue);

  return sumWithInitial;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return [];
  }

  const maxLikesBlog = blogs.reduce((maxBlog, currentBlog) => {
    return currentBlog.likes > maxBlog.likes ? currentBlog : maxBlog;
  }, blogs[0]);

  const result = {
    title: maxLikesBlog.title,
    author: maxLikesBlog.author,
    likes: maxLikesBlog.likes,
  };
  return result;
};

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    Object.keys(authorCounts),
    (author) => authorCounts[author]
  );
  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, "author");
  const authorsWithLikes = _.map(blogsByAuthor, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }));

  // Use _.maxBy to find the author with the maximum total likes
  const topAuthor = _.maxBy(authorsWithLikes, 'likes');
  return topAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
