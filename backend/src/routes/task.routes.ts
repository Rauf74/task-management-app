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
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", taskController.deleteTask);

// PATCH /api/tasks/:id/move - Move task to another column
router.patch("/:id/move", validate(moveTaskSchema), taskController.moveTask);

export default router;
