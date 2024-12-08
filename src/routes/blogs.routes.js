import express from "express";
import {
  addBlog,
  allBlogs,
  singleBlog,
  deleteBlog,
  editBlog,
} from "../controllers/blogs.controllers.js";

const router = express.Router();

router.post("/addBlog", addBlog);
router.get("/allBlogs", allBlogs);
router.get("/blog/:id", singleBlog);
router.delete("/blog/:id", deleteBlog);
router.post("/blog/:id", editBlog);
// router.get("/todobyid", singleTodo);

export default router;
