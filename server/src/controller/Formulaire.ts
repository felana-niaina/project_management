import { Request, Response } from "express";
import { User } from "../entity/User";
import { Invitation } from "../entity/Invitation";
import { Role } from "../entity/Role";
const bcrypt = require("bcrypt");

export default class FormulaireController {
  static createUser = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
      delete data._v;
      delete data._id;
      delete data.idProject;
      const role = await Role.findOne({ name: "ADMINISTRATEUR" });
      await User.create({ ...data, password: hashedPassword, role: role?._id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static registerUser = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      console.log(data);
      const invitation :any= await Invitation.findOne({ mail: req.body.email });
      if (!invitation) {
        // return res.status(400).send("Mail not found");
        try {
          const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
          delete data._v;
          delete data._id;
          const role = await Role.findOne({ name: "ADMINISTRATEUR" });
          await User.create({
            ...data,
            password: hashedPassword,
            role: role?._id,
          });
          res.status(200).send("success");
        } catch (error: any) {
          console.log("error :::::::::::", error);
          res.status(500).send(`Internal server error :${error}`);
        }
      }

      const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
      delete data._v;
      delete data._id;
      delete data.idProject;
      const role = await Role.findOne({ name: "USER" });
      const registerUser = await User.create({
        ...data,
        password: hashedPassword,
        role: role?._id,
      });
      const userProject = await User.updateOne(
        { _id: registerUser._id },
        {
          $push: {
            idProject: invitation.idProject,
          },
        }
      );
      console.log("userProject:::", userProject);
      res.status(200).send("success");
    } catch (error: any) {
      console.log("error :::::::::::", error);
      res.status(500).send(`Internal server error :${error}`);
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const result = await User.find();
      console.log(result);
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static getUsersByProjectId = async (req: Request, res: Response) => {
    try {
      console.log(req.params.id);

      const result = await User.find({ idProject: req.params.id });
      console.log("result", result);
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static updateUser = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const id = data._id;
      delete data._v;
      delete data._id;
      await User.updateOne({ _id: id }, { ...data });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteUser = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await User.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
