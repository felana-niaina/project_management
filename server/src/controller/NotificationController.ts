import { Request, Response } from "express";
import { Notification } from "../entity/Notification";

export default class NotificationController {
  createNotification = async (req: Request, res: Response) => {
    try {
      const createNotification = await Notification.create({ ...req.body });
      console.log("createNotification", createNotification);
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };

  deleteNotification = async (req: Request, res: Response) => {
    try {
      const deleteNotification = await Notification.deleteOne({
        _id: req.params.id,
      });
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };

  getNotification = async (req: Request, res: Response) => {
    try {
      const notif = await Notification.find({ project: req.params.id });
      res.status(200).send({ count: notif.length });
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };
}
