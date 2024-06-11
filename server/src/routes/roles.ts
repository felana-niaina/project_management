import { Router } from "express";
import FormulaireController from "../controller/Formulaire";

const router = Router();

router.get("/:role", FormulaireController.getUsersByRole);
router.get("/", FormulaireController.getRoles);
export default router;