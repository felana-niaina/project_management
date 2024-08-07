import { Router } from "express";
import ColumnController from "../controller/Column";

const router = Router();

// router.get("/:idProject", ColumnController.getColumn);
router.get("/:idProject/sprint/:idSprint", ColumnController.getColumn);
router.post("/", ColumnController.createColumn);
router.patch("/:id", ColumnController.updateColumn);
export default router;
