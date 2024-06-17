import { mailConfig } from "../constant/utils";
import { Invitation } from "../entity/Invitation";
import { Response, Request } from "express";
import { Role } from "../entity/Role";

const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport(mailConfig);

export default class InvitationController {
  sendInvitation = async (req: Request, res: Response) => {
    console.log(req.body);
    const { idProject, nameProject,role, mail } = req.body;
    const userRole = await Role.findById(role);
    let mailOption = {
      from: "nirina.felananiaina@gmail.com",
      to: mail,
      subject: "test",
      html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <h3>nirina.felananiaina@gmail.com vous a invité(e) à rejoindre son projet ${nameProject} en occupant le role de ${userRole?.name}</h3>
                    <p>Veuillez cliquer le bouton ci-dessous pour y rejoindre</p>
                    <button><a href="http://localhost:3000/createUsers">Rejoindre</a></button>
                </body>
                </html>`,
    };
    try {
      const sendingInvitation = await Invitation.create({ ...req.body });
      transporter.sendMail(mailOption, (error: any, info: any) => {
        if (error) {
          return console.log("error sendMail ::::", error.message);
        }
        console.log("success");
      });

      res.status(200).send("success");
    } catch (error) {
      res.status(500).send("internal server error");
    }
  };
}
