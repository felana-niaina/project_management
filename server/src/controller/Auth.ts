import { Request, Response } from "express";
import { SECRET_JWT_CODE } from "../constant/utils";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

export default class AuthController {

  // Login Controller
  login = async (req: Request, res: Response) => {
    try {
      const { mail, password } = req.body;
      const checkUser = await User.findOne({ email: mail });
      if (!checkUser) {
        return res.status(404).send("User not found !");
      }

      // Vérifie si le mot de passe fourni correspond au mot de passe haché stocké pour l'utilisateur.
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
      let idProject = checkUser.idProject[0];
      switch (role.name) {
        case "PRODUCT OWNER":
          redirectPath="/projectList"
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

      // Génère un token JWT pour l'utilisateur avec un identifiant unique,
      // et expire après 3600 secondes (1 heure).
      const token = jwt.sign(
        {
          id: checkUser._id,
        },
        SECRET_JWT_CODE,
        { expiresIn: 3600 }
      );
      
      //met à jour le status de l'utilisateur en connécté
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
      res.status(500).send(`Internal server error : ${e}`);
    }
  };
}
