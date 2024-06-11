import { Request, Response } from "express";
import { TBacklog } from "../types/backlog";
import { Backlog } from "../entity/Backlog";
import mongoose from "mongoose";

export default class backlogController {
  static createBacklog = async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const { idProject } = req.params;
      delete data._v;
      delete data._id;
     
      await Backlog.create(data);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static getAllBacklog = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params; 

      const result = await Backlog.find({ idProject: idProject });
     
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static updateBacklog = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      console.log(data);
      const id = data._id;
      delete data._v;
      delete data._id;
      const update = await Backlog.updateOne({ _id: id }, { ...data });
      console.log("update", update);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteBacklog = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Backlog.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
