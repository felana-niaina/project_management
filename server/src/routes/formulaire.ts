import { Router } from "express";
import FormulaireController from "../controller/Formulaire";

const router = Router();

router.post("/registerUser", FormulaireController.registerUser);

router.post("/:id", FormulaireController.createUser);
router.get("/:id", FormulaireController.getUsersByProjectId);
router.get("/", FormulaireController.getUser);
router.patch("/", FormulaireController.updateUser);

router.put("/:id", FormulaireController.deleteUser);

export default router;
