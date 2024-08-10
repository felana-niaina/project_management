import { Request, Response } from "express";
import { Notification } from "../entity/Notification";
import moment from 'moment';
import { Sprint } from "../entity/Sprint";

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
      const count = await Notification.find({
        idProject: req.params.id,
        read: false,
      }).countDocuments();
      const notif = await Notification.find({
        idProject: req.params.id,
      });
      res.status(200).send({ count, notif });
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };


  notifyUpcomingSprints = async () => {
    try {
      const now = moment();
      const twoDaysLater = moment().add(2, 'days');
  
      // Trouver les sprints qui se terminent dans 2 jours
      const sprints = await Sprint.find({
        endDate: {
          $gte: now.toDate(),
          $lte: twoDaysLater.toDate()
        }
      });
  
      for (const sprint of sprints) {
        // Créer une notification pour chaque utilisateur lié au sprint
        await Notification.create({
          message: `Le"${sprint.name}" se termine dans 2 jours.`,
          project: sprint.idProject,
          read: false, // Marquer comme non lu
          date: new Date()
        });
      }
    } catch (error) {
      console.error('Error notifying upcoming sprints:', error);
    }
  };
}
