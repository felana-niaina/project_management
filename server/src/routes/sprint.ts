import { Router } from "express";
import sprintController from "../controller/sprintController";
const router = Router();
const SprintController = new sprintController();

router.post("/:idProject", SprintController.createSprint);

router.get("/:idProject", SprintController.getAllSprint);
router.get("/column/:idProject", SprintController.getCardCountsForSprints);
router.get("/upcoming/:idProject", SprintController.getUpcomingTasks);
router.patch("/", SprintController.updateSprint);

export default router;
