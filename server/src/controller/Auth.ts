import { Request, Response } from "express";
import { SECRET_JWT_CODE } from "../constant/utils";
import { User } from "../entity/User";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { mail, password } = req.body;
      const checkUser = await User.findOne({ email: mail });
      if (!checkUser) {
        return res.status(404).send("User not found !");
      }

      const checkPassword = await bcrypt.compareSync(
        password,
        checkUser.password,
        10
      );

      if (!checkPassword) {
        return res.status(404).send("Password not match !");
      }
      switch (checkUser.role) {
        case "PRODUCT OWNER":
          console.log("ok");
          return res.redirect("/productOwnerDashboard");
        default:
          break;
      }
      const token = jwt.sign(
        {
          id: checkUser._id,
        },
        SECRET_JWT_CODE,
        { expiresIn: 3600 }
      );
      await User.updateOne(
        { email: mail },
        {
          isConnected: true,
        }
      );
      res.status(200).send({
        user: checkUser,
        token,
        redirectPath: "/productOwnerDashboard",
      });
    } catch (e: any) {
      console.log("error ::::::::::::::::");
      res.status(500).send(`Internal server error : ${e}`);
    }
  };
}
