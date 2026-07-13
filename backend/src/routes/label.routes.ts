import { Router } from "express";
import * as labelController from "../controllers/label.controller.js";
import { validate, createLabelSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

// POST /api/workspaces/:workspaceId/labels - Create label
/**
 * @swagger
 * /api/workspaces/{workspaceId}/labels:
 *   post:
 *     tags: [Label]
 *     summary: Membuat label baru di dalam workspace
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
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
 *               - name
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bug"
 *               color:
 *                 type: string
 *                 example: "#FF0000"
 *     responses:
 *       201:
 *         description: Label berhasil dibuat
 */
router.post("/:workspaceId/labels", validate(createLabelSchema), labelController.createLabel);

// GET /api/workspaces/:workspaceId/labels - Get labels
/**
 * @swagger
 * /api/workspaces/{workspaceId}/labels:
 *   get:
 *     tags: [Label]
 *     summary: Mendapatkan semua label di dalam workspace
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar label berhasil dimuat
 */
router.get("/:workspaceId/labels", labelController.getLabels);

// DELETE /api/workspaces/labels/:id - Delete label (supports both standard and workspaceId-prefixed paths)
/**
 * @swagger
 * /api/workspaces/labels/{id}:
 *   delete:
 *     tags: [Label]
 *     summary: Menghapus label berdasarkan ID
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
 *         description: Label berhasil dihapus
 */
router.delete("/labels/:id", labelController.deleteLabel);
router.delete("/:workspaceId/labels/:id", labelController.deleteLabel);

export default router;
