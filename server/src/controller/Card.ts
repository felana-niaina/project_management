import { Request, Response } from "express";
import { Card } from "../entity/Card";
import { Column } from "../entity/Column";

export default class CardController {
  static createCard = async (req: Request, res: Response) => {
    try {
      const { data, idColumn } = req.body;
      delete data._v;
      delete data._id;
      const createdCard = await Card.create(data);
      if (createdCard) {
        await Column.updateOne(
          { _id: idColumn },
          {
            $push: {
              cards: createdCard._id,
            },
          }
        );
      }
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static getCard = async (req: Request, res: Response) => {
    try {
      const result = await Card.find();
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static updateCard = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      console.log(data);
      const id = data._id;
      delete data._v;
      delete data._id;
      const update = await Card.updateOne({ _id: id }, { ...data });
      console.log("update", update);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteCard = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Card.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
