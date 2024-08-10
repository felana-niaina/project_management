import { Router } from "express";
import NotificationController from "../controller/NotificationController";
const router = Router();
const notificationController = new NotificationController();

router.get("/:id", notificationController.getNotification);
router.get("/notifyUpcomingSprints", notificationController.notifyUpcomingSprints);

router.post("/", notificationController.createNotification);

router.delete("/:id", notificationController.deleteNotification);

export default router;
