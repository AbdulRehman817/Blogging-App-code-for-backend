import Blogs from "../models/blogs.models.js";

import mongoose from "mongoose";
// add todo

const addBlog = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400).json({
      message: "title or description required",
    });
    return;
  }

  const blog = Blogs.create({
    title,
    description,
  });
  blog;
  // get all todo

  res.status(201).json({
    message: "blog added to database successfully",
  });
};

//all todos
const allBlogs = async (req, res) => {
  const todos = await Blogs.find({});
  res.status(201).json({
    message: "Blogs retrieved successfully.",
    todos: todos,
  });
};

// get single todo

const singleBlog = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ erroe: "No such todos" });
  }

  const blog = await Blogs.findById(id);
  res.status(201).json({
    message: "single todo found",
    blog,
  });
};
// delete todo
const deleteBlog = async (req, res) => {
  const { id } = req.params; // Get id from the request params

  // Validate the provided id to make sure it's a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: "No such todos" });
  }

  // Attempt to find and delete the todo item by the provided id
  const blog = await Blogs.findByIdAndDelete(id);

  // If the todo is not found, return a 400 error
  if (!blog) {
    return res.status(400).json({
      error: "No todo found",
    });
  }

  // If the todo is deleted successfully, return a success message
  return res.status(200).json({
    message: "Todo deleted successfully",
  });
};

// edit todo
const editBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.json({ error: "No such todos" });
  }
  const blog = await Blogs.findByIdAndUpdate(
    id,
    {
      title,
      description,
    },
    { new: true }
  );
  if (!blog) {
    return res.status(400).json({
      error: "No todo found",
    });
  }
  return res.status(200).json(blog);
};

export { addBlog, allBlogs, singleBlog, deleteBlog, editBlog };
