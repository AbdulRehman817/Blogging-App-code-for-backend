import usersModels from "../models/users.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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
export { registerUser, loginUser, logOut };
