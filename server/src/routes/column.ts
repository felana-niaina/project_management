import { Router } from "express";
import ColumnController from "../controller/Column";

const router = Router();

router.post("/", ColumnController.createColumn);

router.get("/:idProject", ColumnController.getColumn);

export default router;
