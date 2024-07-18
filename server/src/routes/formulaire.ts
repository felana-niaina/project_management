import { Router } from "express";
import FormulaireController from "../controller/Formulaire";

const router = Router();

router.post("/registerUser", FormulaireController.registerUser);

router.post("/:id", FormulaireController.createUser);
router.get("/:id", FormulaireController.getUsersByProjectId);
router.get("/:id", FormulaireController.getUsersByProjectId);
router.get("/taskByUser", FormulaireController.getUsersTaskCounts);
router.patch("/", FormulaireController.updateUser);

router.put("/:id", FormulaireController.deleteUser);

export default router;
