const express = require("express");
const router = express.Router();

const {
  authUser,
  authorizedPermission,
} = require("../middleware/authentication");

const {
  addBlog,
  showBlogs,
  deleteBlog,
} = require("../controllers/blogController");

router.post("/addBlog", authUser, authorizedPermission("admin"), addBlog);
router.get("/showBlogs", showBlogs);
router.delete(
  "/deleteBlog",
  authUser,
  authorizedPermission("admin"),
  deleteBlog
);

module.exports = router;
