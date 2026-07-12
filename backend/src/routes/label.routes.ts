import { Router } from "express";
import * as labelController from "../controllers/label.controller.js";
import { validate, createLabelSchema } from "../middleware/validation.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/:workspaceId/labels", validate(createLabelSchema), labelController.createLabel);
router.get("/:workspaceId/labels", labelController.getLabels);
router.delete("/:workspaceId/labels/:id", labelController.deleteLabel);

export default router;
