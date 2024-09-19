import { Router } from "express";
import sprintController from "../controller/sprintController";
const router = Router();
const SprintController = new sprintController();

router.post("/:idProject", SprintController.createSprint);

router.get("/:idProject", SprintController.getAllSprint);
router.get("/column/:idProject", SprintController.getCardCountsForSprints);
router.get("/upcoming/:idProject", SprintController.getUpcomingTasks);
router.get("/totalTaskCounts/:idProject", SprintController.getTotalTaskCountsForProject);
router.get("/taskCountsForChart/:idProject", SprintController.getTaskCountsForChart);
router.patch("/:idProject", SprintController.updateSprint);
router.put("/:idProject", SprintController.deleteSprint);

export default router;
