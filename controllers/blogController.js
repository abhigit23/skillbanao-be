const blogModel = require("../models/Blog");
const { StatusCodes } = require("http-status-codes");

const addBlog = async (req, res) => {
  const { title, content, image } = req.body;

  const blog = await blogModel.create({ title, content, image });
  res.status(StatusCodes.CREATED).json({
    blog: {
      title: blog.title,
      content: blog.content,
      image: blog.image,
    },
  });
};

const showBlogs = async (req, res) => {
  const blogs = await blogModel.find({});
  res.status(StatusCodes.OK).json({ blogs });
};

module.exports = {
  addBlog,
  showBlogs,
};
