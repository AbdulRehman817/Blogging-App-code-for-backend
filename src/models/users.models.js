import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userProfileImg: {
    type: String,
    required: true,
  },
});

userSchema.pre(
  "save",
  async function (next) {
    // Check if the password is modified or it's a new document
    if (!this.isModified("password")) return next();

    try {
      // Hash the password before saving the user
      this.password = await bcrypt.hash(this.password, 10);
      next(); // Continue with the save operation
    } catch (err) {
      // If error occurs during password hashing
      next(err); // Pass the error to the next middleware/error handler
    }
  },
  {}
);
export default mongoose.model("Users", userSchema);
