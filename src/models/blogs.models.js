import mongoose from "mongoose";
import bcrypt from "bcrypt";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Blogs", BlogSchema);
