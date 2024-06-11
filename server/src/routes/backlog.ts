import { Router } from "express";
import backlogController from "../controller/backlogController";
const router = Router();

router.post("/:idProject", backlogController.createBacklog);

router.get("/:idProject", backlogController.getAllBacklog);
router.patch("/", backlogController.updateBacklog);

export default router;
