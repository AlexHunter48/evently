import express from "express"

import { getAllUsers,getCurrentUser } from "../controllers/userController.js"

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getCurrentUser );

router.get("/allusers", verifyToken, getAllUsers);


export default router