import { Router } from "express";
import * as labelController from "../controllers/label.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/:workspaceId/labels", labelController.createLabel);
router.get("/:workspaceId/labels", labelController.getLabels);
router.delete("/labels/:id", labelController.deleteLabel);

export default router;
