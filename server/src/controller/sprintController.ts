import { Request, Response } from "express";
import { Sprint } from "../entity/Sprint";

export default class sprintController {
  createSprint = async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const { idProject } = req.params;
      delete data._v;
      delete data._id;
     
      await Sprint.create(data);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
   getAllSprint = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params; 

      const result = await Sprint.find({ idProject: idProject });
     
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

   updateSprint = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      console.log(data);
      const id = data._id;
      delete data._v;
      delete data._id;
      const update = await Sprint.updateOne({ _id: id }, { ...data });
      console.log("update", update);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteSprint = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Sprint.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
