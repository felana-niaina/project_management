import { Router } from "express";
import UserController from "../controller/UserController";
import FormulaireController from "../controller/Formulaire";

const router = Router();
const userController = new UserController();

router.get("/getOne/:id", userController.getOneUserById);
router.get("/");
router.post("/", FormulaireController.createUser);

export default router;
