import express from "express";

import {
  registerUser,
  loginUser,
  googleSignIn,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google-signin", googleSignIn);

export default router;
