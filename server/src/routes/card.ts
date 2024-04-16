import { Router } from "express";
import CardController from "../controller/Card";

const router = Router();

router.post("/", CardController.createCard);

router.get("/", CardController.getCard);
router.get("/", CardController.updateCard);

export default router;
