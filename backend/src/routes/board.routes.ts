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
router.get("/:id", boardController.getBoard);

// PUT /api/boards/:id - Update board
router.put("/:id", validate(updateBoardSchema), boardController.updateBoard);

// DELETE /api/boards/:id - Delete board
router.delete("/:id", boardController.deleteBoard);

// ==============================================
// Nested Routes for Columns
// ==============================================

import * as columnController from "../controllers/column.controller.js";
import { columnSchema } from "../middleware/validation.js";

// POST /api/boards/:boardId/columns - Create column
router.post("/:boardId/columns", validate(columnSchema), columnController.createColumn);

// ==============================================
// Nested Routes for Tasks
// ==============================================

import * as taskController from "../controllers/task.controller.js";
import { taskSchema } from "../middleware/validation.js";

// POST /api/boards/:boardId/columns/:columnId/tasks - Create task via column
// Note: We'll also add a simpler route in column routes

export default router;
