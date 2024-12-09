import express from "express";
import { uploadImage } from "../controllers/users.controllers.js";
import { upload } from "../middlewares/user.multer.js";
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
router.post("/logout", logOut);
router.post("/uploadimage", upload.single("image"), uploadImage);

// router.post("/loginUser", loginUser);
export default router;
