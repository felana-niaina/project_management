import { Response, Request } from "express";
import { defaultColumn } from "../constant/utils";
import { Column } from "../entity/Column";
import { Project } from "../entity/Project";
import { User } from "../entity/User";

export default class ProjectController {
  createProject = async (req: Request, res: Response) => {
    try {
      const createdColumn = await Column.insertMany(defaultColumn);
      await Project.create({
        name: req.body.data.name,
        description: req.body.data.description,
        startDate: req.body.data.startDate,
        endDate: req.body.data.endDate,
        column: createdColumn,
      });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send(`Internal server error : ${e}`);
    }
  };

  getProject = async (req: Request, res: Response) => {
    try {
      const result = await Project.find();
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send(`Internal server error : ${e}`);
    }
  };

  getSelectedProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await Project.findById(id).populate({
        path: "column",
        populate: {
          path: "cards",
        },
      });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(`Internal server error : ${error}`);
    }
  };

  getListProject = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id).populate({
        path: "role",
      });

      let query = {};
      if (user && user.role.name !== "PRODUCT OWNER") {
        query = { _id: { $in: [user?.idProject] } };
      }
      const result = await Project.find(query);
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send(`Internal server error : ${error}`);
    }
  };
}
