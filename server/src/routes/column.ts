import { Router } from "express";
import ColumnController from "../controller/Column";

const router = Router();

router.get("/:idProject", ColumnController.getColumn);
router.post("/", ColumnController.createColumn);
router.patch("/:id", ColumnController.updateColumn);
export default router;
