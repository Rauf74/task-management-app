// ==============================================
// Board Routes
// ==============================================

import { Router } from "express";
import * as boardController from "../controllers/board.controller.js";
import { validate, boardSchema, updateBoardSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

// GET /api/boards/:id - Get board with columns & tasks
/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     tags: [Board]
 *     summary: Mendapatkan data board beserta kolom dan tugasnya
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memuat data board
 *       404:
 *         description: Board tidak ditemukan
 */
router.get("/:id", boardController.getBoard);

// PUT /api/boards/:id - Update board
/**
 * @swagger
 * /api/boards/{id}:
 *   put:
 *     tags: [Board]
 *     summary: Memperbarui nama dan deskripsi board
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sprint Planning Baru"
 *               description:
 *                 type: string
 *                 example: "Deskripsi board diperbarui"
 *     responses:
 *       200:
 *         description: Board berhasil diperbarui
 *       404:
 *         description: Board tidak ditemukan
 */
router.put("/:id", validate(updateBoardSchema), boardController.updateBoard);

// DELETE /api/boards/:id - Delete board
/**
 * @swagger
 * /api/boards/{id}:
 *   delete:
 *     tags: [Board]
 *     summary: Menghapus board
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board berhasil dihapus
 *       404:
 *         description: Board tidak ditemukan
 */
router.delete("/:id", boardController.deleteBoard);

// ==============================================
// Nested Routes for Columns
// ==============================================

import * as columnController from "../controllers/column.controller.js";
import { columnSchema } from "../middleware/validation.js";

// POST /api/boards/:boardId/columns - Create column
/**
 * @swagger
 * /api/boards/{boardId}/columns:
 *   post:
 *     tags: [Column]
 *     summary: Membuat kolom baru di dalam board
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "To Do"
 *     responses:
 *       201:
 *         description: Kolom berhasil dibuat
 */
router.post("/:boardId/columns", validate(columnSchema), columnController.createColumn);

// ==============================================
// Nested Routes for Tasks
// ==============================================

import * as taskController from "../controllers/task.controller.js";
import { taskSchema } from "../middleware/validation.js";

// POST /api/boards/:boardId/columns/:columnId/tasks - Create task via column
// Note: We'll also add a simpler route in column routes

export default router;
