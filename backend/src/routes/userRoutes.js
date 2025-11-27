import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", protect, admin, registerUser); // only admin can create users
router.post("/login", loginUser);
router.get("/", protect, admin, getUsers);

export default router;
