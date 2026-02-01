// ==============================================
// Workspace Routes
// ==============================================

import { Router } from "express";
import * as workspaceController from "../controllers/workspace.controller.js";
import * as activityController from "../controllers/activity.controller.js";
import { validate, workspaceSchema, updateWorkspaceSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(requireAuth);

// ==============================================
// Analytics & Activity Routes
// ==============================================

/**
 * @swagger
 * /api/workspaces/{id}/analytics:
 *   get:
 *     tags: [Workspace]
 *     summary: Get workspace analytics
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
 *         description: Workspace analytics data
 */
router.get("/:id/analytics", workspaceController.getAnalytics);

/**
 * @swagger
 * /api/workspaces/{id}/activities:
 *   get:
 *     tags: [Workspace]
 *     summary: Get workspace activities
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
 *         description: Workspace activity log
 */
router.get("/:id/activities", activityController.getActivities);

// ==============================================
// Nested Routes for Boards
// ==============================================
/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     tags: [Workspace]
 *     summary: Get all workspaces
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 */
router.get("/", workspaceController.getWorkspaces);

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     tags: [Workspace]
 *     summary: Create workspace
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created
 */
router.post("/", validate(workspaceSchema), workspaceController.createWorkspace);

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     tags: [Workspace]
 *     summary: Get workspace by ID
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
 *         description: Workspace detail with boards
 */
router.get("/:id", workspaceController.getWorkspace);

/**
 * @swagger
 * /api/workspaces/{id}:
 *   put:
 *     tags: [Workspace]
 *     summary: Update workspace
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
 *         description: Workspace updated
 */
router.put("/:id", validate(updateWorkspaceSchema), workspaceController.updateWorkspace);

/**
 * @swagger
 * /api/workspaces/{id}:
 *   delete:
 *     tags: [Workspace]
 *     summary: Delete workspace
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
 *         description: Workspace deleted
 */
// (Removed from here, moving to top)
router.delete("/:id", workspaceController.deleteWorkspace);

// ==============================================
// Nested Routes for Boards
// ==============================================

import * as boardController from "../controllers/board.controller.js";
import { boardSchema } from "../middleware/validation.js";

// GET /api/workspaces/:workspaceId/boards - List boards in workspace
router.get("/:workspaceId/boards", boardController.getBoards);

// POST /api/workspaces/:workspaceId/boards - Create board
router.post("/:workspaceId/boards", validate(boardSchema), boardController.createBoard);

export default router;

