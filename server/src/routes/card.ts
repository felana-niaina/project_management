import { Router } from "express";
import CardController from "../controller/Card";

const router = Router();

router.post("/", CardController.createCard);

router.get("/", CardController.getCard);
router.patch("/", CardController.updateCard);

export default router;
