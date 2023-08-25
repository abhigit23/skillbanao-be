const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide the Blog Title!"],
  },

  content: {
    type: String,
    required: [true, "Please provide the Blog Content!"],
  },

  image: {
    type: String,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
