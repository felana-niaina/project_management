import { Request, Response } from "express";
import { Column } from "../entity/Column";
import { Project } from "../entity/Project";

export default class ColumnController {
  static createColumn = async (req: Request, res: Response) => {
    try {
      const { data, projectName } = req.body;
      delete data._v;
      delete data._id;
      const createdColumn = await Column.create(data);
      await Project.updateOne(
        { name: projectName },
        {
          $push: {
            column: createdColumn?._id,
          },
        }
      );
      res.status(200).send({ createdColumn });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static getColumn = async (req: Request, res: Response) => {
    const id = req.params.idProject;
    console.log("id ::::::", id);
    try {
      const project = await Project.findOne({
        _id: id,
        // _id: "659936561e687648d0dcf728",
      });

      const arrayId = project?.column?.map((item) => item._id);
      if (arrayId?.length && arrayId.length > 0) {
        const result = await Column.find({
          _id: { $in: arrayId },
        }).populate("cards");
        res.status(200).send({
          result,
        });
      }
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static updateColumn = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const id = data._id;
      delete data._v;
      delete data._id;
      await Column.updateOne({ _id: id }, { ...data });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteColumn = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Column.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
