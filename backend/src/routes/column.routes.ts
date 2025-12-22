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
router.patch("/reorder", validate(reorderColumnsSchema), columnController.reorderColumns);

// PUT /api/columns/:id - Update column
router.put("/:id", validate(updateColumnSchema), columnController.updateColumn);

// DELETE /api/columns/:id - Delete column
router.delete("/:id", columnController.deleteColumn);

// ==============================================
// Nested Routes for Tasks
// ==============================================

import * as taskController from "../controllers/task.controller.js";
import { taskSchema } from "../middleware/validation.js";

// POST /api/columns/:columnId/tasks - Create task
router.post("/:columnId/tasks", validate(taskSchema), taskController.createTask);

export default router;
