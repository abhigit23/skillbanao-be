const express = require("express");
const router = express.Router();

const { addBlog, showBlogs } = require("../controllers/blogController");

router.post("/addBlog", addBlog);
router.get("/showBlogs", showBlogs);

module.exports = router;
