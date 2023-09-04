const { BadRequestError } = require("../errors");
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

const deleteBlog = async (req, res) => {
  const { blogId } = req.body;
  const blog = await blogModel.findByIdAndDelete({ _id: blogId });
  if (!blog) throw new BadRequestError("Blog not found!");
  res.status(StatusCodes.OK).json({ msg: "Blog removed successfully!" });
};

module.exports = {
  addBlog,
  showBlogs,
  deleteBlog,
};
