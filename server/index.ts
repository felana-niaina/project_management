import mongoose from "mongoose";
let cors = require("cors");
import routes from "./src/routes";
import bodyParser from "body-parser";
const express = require("express");
import { Server } from "socket.io";
import { Notification } from "./src/entity/Notification";
import { mailConfig } from "./src/constant/utils";

const nodemailer = require("nodemailer");
const app = express();
const http = require("http");

// bjyt rmik astn jedm
let transporter = nodemailer.createTransport(mailConfig);

let mailOption = {
  from: "nirina.felananiaina@gmail.com",
  to: "fara.haingonirina@gmail.com",
  subject: "test",
  html: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  </head>
  <body>
      <h1>test</h1>
  </body>
  </html>`,
  // attachement: []
};

// transporter.sendMail(mailOption, (error: any, info: any) => {
//   if (error) {
//     return console.log("error sendMail ::::", error.message);
//   }
//   console.log("success");
// });

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "HEAD"],
  })
);

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((e) => {
    console.log(`Error on connect on mongoDB :${e}`);
  });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "HEAD"],
  },
});
io.on("connect", (socket) => {
  socket.on("send_notification", async (data) => {
    await Notification.create({ ...data });
    io.emit("receive_notification", data);
  });
});

app.use(bodyParser.json());
app.use("/", routes);
app.use("/file", express.static("uploads"));

server.listen(3009, () => {
  console.log("server listening on port 3009");
});
