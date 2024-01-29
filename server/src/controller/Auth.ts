import { Request, Response } from "express";
import { SECRET_JWT_CODE } from "../constant/utils";
import { User } from "../entity/User";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default class AuthController {
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const checkUser = await User.findOne({ username });
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

      const token = jwt.sign(
        {
          id: checkUser._id,
        },
        SECRET_JWT_CODE,
        { expiresIn: 3600 }
      );
      res.status(200).send({
        user: checkUser,
        token,
      });
    } catch (e: any) {
      console.log("error ::::::::::::::::");
      res.status(500).send(`Internal server error : ${e}`);
    }
  };
}
