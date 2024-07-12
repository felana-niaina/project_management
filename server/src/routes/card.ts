import { Router } from "express";
import CardController from "../controller/Card";

const router = Router();

router.post("/", CardController.createCard);

router.get("/", CardController.getCard);
router.post("/search", CardController.filteredCard);
router.post('/move', CardController.moveCard);
router.patch("/", CardController.updateCard);
router.put("/:id", CardController.deleteCard);


export default router;
