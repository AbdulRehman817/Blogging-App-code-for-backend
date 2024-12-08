import express from "express";
import {
  registerUser,
  loginUser,
  logOut,
} from "../controllers/users.controllers.js";
const router = express.Router();
// router.post("/encryptPassword", encryptPassword);
// router.post("/refreshToken", generateRefreshToken);
// router.post("/accessToken", generateAccessToken);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logOut", logOut);
// router.post("/loginUser", loginUser);
export default router;
