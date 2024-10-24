import { Request, Response } from "express";
import { SECRET_JWT_CODE } from "../constant/utils";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
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
      let redirectPath="";
      let role :any= await Role.findById(checkUser.role)
      let idProject = checkUser.idProject;
      switch (role.name) {
        case "PRODUCT OWNER":
          redirectPath="/productOwnerDashboard"
          break;
        case "SCRUM MANAGER":
          redirectPath=`/dashboardScrum/${idProject}`
          break;
        case "DEVELOPPEUR":
          redirectPath="/accueil/669bb17b3e773e841c453d81"
          break;
        case "TESTEUR":
          redirectPath="/accueil/669bb17b3e773e841c453d81"
          break;
        
        default:
          redirectPath="/"
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
        redirectPath,
      });
    } catch (e: any) {
      console.log("error ::::::::::::::::");
      res.status(500).send(`Internal server error : ${e}`);
    }
  };
}
