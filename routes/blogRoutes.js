const express = require("express");
const router = express.Router();

const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");

const { addBlog, showBlogs } = require("../controllers/blogController");

router.post("/addBlog", authUser, authorizedPermission("admin"), addBlog);
router.get("/showBlogs", showBlogs);

module.exports = router;
