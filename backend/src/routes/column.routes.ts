// ==============================================
// Column Routes
// ==============================================

import { Router } from "express";
import * as columnController from "../controllers/column.controller.js";
import { validate, columnSchema, updateColumnSchema, reorderColumnsSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

// PATCH /api/columns/reorder - Reorder columns
/**
 * @swagger
 * /api/columns/reorder:
 *   patch:
 *     tags: [Column]
 *     summary: Mengatur ulang urutan kolom
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - columnIds
 *             properties:
 *               columnIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["col1", "col2", "col3"]
 *     responses:
 *       200:
 *         description: Urutan kolom berhasil diperbarui
 */
router.patch("/reorder", validate(reorderColumnsSchema), columnController.reorderColumns);

// PUT /api/columns/:id - Update column
/**
 * @swagger
 * /api/columns/{id}:
 *   put:
 *     tags: [Column]
 *     summary: Mengubah judul kolom
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
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "In Progress"
 *     responses:
 *       200:
 *         description: Judul kolom berhasil diperbarui
 */
router.put("/:id", validate(updateColumnSchema), columnController.updateColumn);

// DELETE /api/columns/:id - Delete column
/**
 * @swagger
 * /api/columns/{id}:
 *   delete:
 *     tags: [Column]
 *     summary: Menghapus kolom beserta seluruh tugas di dalamnya
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
 *         description: Kolom berhasil dihapus
 */
router.delete("/:id", columnController.deleteColumn);

// ==============================================
// Nested Routes for Tasks
// ==============================================

import * as taskController from "../controllers/task.controller.js";
import { taskSchema } from "../middleware/validation.js";

// POST /api/columns/:columnId/tasks - Create task
/**
 * @swagger
 * /api/columns/{columnId}/tasks:
 *   post:
 *     tags: [Task]
 *     summary: Membuat tugas (task) baru di dalam kolom
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: columnId
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
 *                 example: "Desain UI Navbar"
 *               description:
 *                 type: string
 *                 example: "Membuat mockup dan desain SVG navbar"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 example: "MEDIUM"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-07-20T10:00:00Z"
 *               labelIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["label1", "label2"]
 *     responses:
 *       201:
 *         description: Tugas berhasil dibuat
 */
router.post("/:columnId/tasks", validate(taskSchema), taskController.createTask);

export default router;
