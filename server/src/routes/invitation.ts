import { Router } from "express";

import InvitationController from "../controller/Invitation";
const router = Router();
const notificationController = new InvitationController();

router.post("/", notificationController.sendInvitation);

export default router;
