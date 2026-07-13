// ==============================================
// Task Routes
// ==============================================

import { Router } from "express";
import * as taskController from "../controllers/task.controller.js";
import { validate, updateTaskSchema, moveTaskSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.use(requireAuth);

// PUT /api/tasks/:id - Update task
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     tags: [Task]
 *     summary: Memperbarui data tugas (task)
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
 *               title:
 *                 type: string
 *                 example: "Desain UI Navbar (v2)"
 *               description:
 *                 type: string
 *                 example: "Revisi desain navbar"
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 example: "HIGH"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: "2026-07-25T12:00:00Z"
 *               labelIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["label1"]
 *     responses:
 *       200:
 *         description: Tugas berhasil diperbarui
 *       404:
 *         description: Tugas tidak ditemukan
 */
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     tags: [Task]
 *     summary: Menghapus tugas (task)
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
 *         description: Tugas berhasil dihapus
 *       404:
 *         description: Tugas tidak ditemukan
 */
router.delete("/:id", taskController.deleteTask);

// PATCH /api/tasks/:id/move - Move task to another column
/**
 * @swagger
 * /api/tasks/{id}/move:
 *   patch:
 *     tags: [Task]
 *     summary: Memindahkan tugas ke kolom lain atau mengubah urutan posisinya
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
 *               - columnId
 *               - order
 *             properties:
 *               columnId:
 *                 type: string
 *                 example: "col2"
 *               order:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       200:
 *         description: Posisi tugas berhasil dipindahkan
 *       404:
 *         description: Kolom atau tugas tidak ditemukan
 */
router.patch("/:id/move", validate(moveTaskSchema), taskController.moveTask);

export default router;
