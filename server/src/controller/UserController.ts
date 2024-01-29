import { Request, Response } from "express";
import { User } from "../entity/User";
import { Role } from "../entity/Role";

export default class UserController {
  getOneUserById = async (req: Request, res: Response) => {
    try {
      const role = await Role.findById("65b24cbefadec4a6886e95f5");
      const user = await User.findById(req.params.id).populate({
        path: "role",
      });
      res.status(200).send({ user });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
