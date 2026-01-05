import express from "express";
import { login,  getProduct } from "../controllers/authController"; // Make sure getProfile is imported
import { auth } from "../middleware/auth";

const router = express.Router();

// Public routes
// router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/products", auth, getProduct); // ✅ This will use the auth middleware

export default router;