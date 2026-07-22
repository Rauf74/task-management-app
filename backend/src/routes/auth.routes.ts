// ==============================================
// Auth Routes
// ==============================================
//
// Definisi endpoint authentication:
// POST /api/auth/register - Daftar user baru
// POST /api/auth/login    - Login
// POST /api/auth/logout   - Logout
// GET  /api/auth/me       - Get current user
// PATCH /api/auth/me      - Update profile (name)
// POST /api/auth/change-password - Change password
//
// ==============================================

import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate, registerSchema, loginSchema, updateMeSchema, changePasswordSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// ==============================================
// Public Routes
// ==============================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register user baru
 *     description: Mendaftarkan user baru dengan nama, email, dan password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Login dengan email dan password, mendapatkan JWT cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login berhasil
 *         headers:
 *           Set-Cookie:
 *             description: JWT token dalam HttpOnly cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Email atau password salah
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 *     description: Menghapus JWT cookie
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /api/auth/demo:
 *   post:
 *     tags: [Auth]
 *     summary: Quick Login Demo User Generation
 *     description: Membuat user demo acak secara otomatis beserta data sampel (Workspace, Board, Tasks), menerbitkan cookie JWT, dan mengembalikan kredensial acak
 *     responses:
 *       200:
 *         description: Akun demo berhasil dibuat dan terautentikasi
 *         headers:
 *           Set-Cookie:
 *             description: JWT token dalam HttpOnly cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     credentials:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                         password:
 *                           type: string
 *                     redirectUrl:
 *                       type: string
 *                 message:
 *                   type: string
 */
router.post("/demo", authController.quickDemo);
router.post("/quick-demo", authController.quickDemo);

// ==============================================
// Protected Routes
// ==============================================

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user
 *     description: Mendapatkan data user yang sedang login
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - properties:
 *                     data:
 *                       properties:
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - token tidak valid atau tidak ada
 */
router.get("/me", requireAuth, authController.me);

router.patch("/me", requireAuth, validate(updateMeSchema), authController.updateMe);

router.post("/change-password", requireAuth, validate(changePasswordSchema), authController.changePassword);

export default router;
