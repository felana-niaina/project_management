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

      const invitation = await Invitation.findOne({ mail: req.body.email });
      if (!invitation) {
        return res.status(400).send("Mail not found");
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
      await User.updateOne(
        { _id: registerUser._id },
        {
          $push: {
            idProject: invitation.idProject,
          },
        }
      );
      res.status(200).send("success");
    } catch (error: any) {
      console.log("error :::::::::::", error);
      res.status(500).send(`Internal server error :${error}`);
    }
  };

  static getUser = async (req: Request, res: Response) => {
    try {
      const result = await User.find();
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
