import { Request, Response } from "express";
import { Message } from "../entity/Message";

export default class MessageController {
  createMessage = async (req: Request, res: Response) => {
    try {
      const createMessage = await Message.create({ ...req.body });
      console.log("createMessage", createMessage);
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };

  deleteMessage = async (req: Request, res: Response) => {
    try {
      const deleteMessage = await Message.deleteOne({
        _id: req.params.id,
      });
      res.status(200).send("success");
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };

  getMessage = async (req: Request, res: Response) => {
    try {
      const messages = await Message.find({ room: req.params.room });
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };
}
