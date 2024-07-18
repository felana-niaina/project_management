import { Request, Response } from "express";
import { Card } from "../entity/Card";
import { Column } from "../entity/Column";
import { Project } from "../entity/Project";
import mongoose from "mongoose";

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

  static filteredCard = async (req: Request, res: Response) => {
    try {
      const { text, id } = req.body;
      // const result = await Card.aggregate([
      //   {
      //     $match: {
      //       $or: [
      //         { title: { $regex: _query, options: "i" } },
      //         { description: { $regex: _query, options: "i" } },
      //         { assignee: { $regex: _query, options: "i" } },
      //       ],
      //     },
      //   },
      // ]);

      const resultProject = await Project.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "columns",
            foreignField: "_id",
            localField: "column",
            pipeline: [
              {
                $lookup: {
                  from: "cards",
                  localField: "cards",
                  foreignField: "_id",
                  let: {
                    title: "$title",
                    description: "$description",
                    assignee: "$assignee",
                  },
                  pipeline: [
                    {
                      $match: {
                        $or: [
                          { title: { $regex: text, $options: "i" } },
                          { description: { $regex: text, $options: "i" } },
                          { assignee: { $regex: text, $options: "i" } },
                        ],
                      },
                    },
                  ],
                  as: "cards",
                },
              },
            ],
            as: "column",
          },
        },
      ]);
      console.log(resultProject);
      res.status(200).send({
        resultProject,
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

  static moveCard = async (req: Request, res: Response) => {
    try {
      const { cardId, sourceColumnId, targetColumnId } = req.body;
  
      // Remove the card from the source column
      await Column.updateOne(
        { _id: sourceColumnId },
        { $pull: { cards: cardId } }
      );
  
      // Add the card to the target column
      await Column.updateOne(
        { _id: targetColumnId },
        { $push: { cards: cardId } }
      );
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteCard = async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      await Card.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
