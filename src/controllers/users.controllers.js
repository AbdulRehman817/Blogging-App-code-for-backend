import usersModels from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//upload image code

//cloudnary config
cloudinary.config({
  cloud_name: "dd3acvocv",
  api_key: "272486676496985",
  api_secret: "v7RBaDnZFP3X0nCcEl9YOKxDoNA",
});

const uploadImageToCloudinary = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    await fs.promises.unlink(localpath); // Asynchronous file deletion
    return uploadResult.url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);

    try {
      if (fs.existsSync(localpath)) {
        await fs.promises.unlink(localpath);
      }
    } catch (unlinkError) {
      console.error("Error deleting file:", unlinkError.message);
    }

    return null;
  }
};

const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "6h",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).json({
      message: "email is required",
    });
  }
  if (!password) {
    res.status(400).json({
      message: "email is required",
    });
  }

  const user = await usersModels.findOne({
    email: email,
  });
  if (user) {
    res.status(401).json({
      message: "user already exist",
    });
  }

  try {
    const createUser = usersModels({
      email,
      password,
    });
    await createUser.save();

    res.status(201).json({
      message: "user registerd",
      registerUser,
      email,
      password,
    });
  } catch (err) {
    res.status(500).json({
      message: "error is occurring while registering",
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersModels.findOne({
    email: email,
  });
  if (!user) {
    res.status(400).json({
      message: "user not found",
    });
  } else {
    if (!email) {
      res.status(400).json({
        message: "email is required",
      });
    }
    if (!password) {
      res.status(400).json({
        message: "email is required",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "invalid passoword",
      });
    }
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  res.cookie("refreshToken", refreshToken, { http: true, secure: false });
  // cookies

  res.json({
    message: "user loggedIn successfully",
    accessToken,
    refreshToken,
    data: user,
  });
};
const logOut = async (req, res) => {
  res.clearCookie("refreshToken", { path: "/" });
  res.json({ message: "user logout successfully" });
};

const authenticateUser = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(404).json({ message: "no token found" });

  jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "invalid token" });
    req.user = user;
    next();
  });
};

const uploadImage = async (req, res) => {
  // Check if a file is provided in the request
  if (!req.file) {
    return res.status(400).json({
      message: "No image file uploaded",
    });
  }

  try {
    // Upload the image to Cloudinary
    const uploadResult = await uploadImageToCloudinary(req.file.path);

    if (!uploadResult) {
      return res.status(500).json({
        message: "Error occurred while uploading the image to Cloudinary",
      });
    }

    // Respond with the uploaded image URL
    res.status(200).json({
      message: "Image uploaded successfully",
      url: uploadResult,
    });
  } catch (error) {
    console.error("Error in uploadImage function:", error.message);

    // Return a detailed error message
    res.status(500).json({
      message: "An internal server error occurred during the image upload",
    });
  }
};

export { registerUser, loginUser, logOut, authenticateUser, uploadImage };
