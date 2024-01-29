import { Router } from "express";
import ProjectController from "../controller/ProjectController";

const router = Router();

const projectController = new ProjectController();

router.post("/", projectController.createProject);

router.get("/", projectController.getProject);

router.get("/selectedProject/:id", projectController.getSelectedProject);

router.get("/listProject/:id", projectController.getListProject);

export default router;
