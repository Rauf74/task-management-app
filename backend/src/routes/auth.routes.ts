// ==============================================
// Auth Routes
// ==============================================
//
// Definisi endpoint authentication:
// POST /api/auth/register - Daftar user baru
// POST /api/auth/login    - Login
// POST /api/auth/logout   - Logout
// GET  /api/auth/me       - Get current user
//
// ==============================================

import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate, registerSchema, loginSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// ==============================================
// Public Routes
// ==============================================

// Register
router.post("/register", validate(registerSchema), authController.register);

// Login
router.post("/login", validate(loginSchema), authController.login);

// Logout
router.post("/logout", authController.logout);

// ==============================================
// Protected Routes
// ==============================================

// Get current user
router.get("/me", requireAuth, authController.me);

export default router;
