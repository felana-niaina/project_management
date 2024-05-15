import mongoose from "mongoose";
let cors = require("cors");
import routes from "./src/routes";
import bodyParser from "body-parser";
const express = require("express");
import { Server } from "socket.io";
import { Notification } from "./src/entity/Notification";
import { Message } from "./src/entity/Message";
import NotificationController from "./src/controller/NotificationController";
const nodemailer = require("nodemailer");
const app = express();
const http = require("http");

// bjyt rmik astn jedm

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
  console.log("User connected");

  // Logique pour les notifications
  socket.on("send_notification", async (data) => {
    const notif = await Notification.create({ ...data });
    io.emit("receive_notification", data);
  });

  // Logique pour le chat
  socket.on("joinRoom", ({ username, room }) => {
    (socket as any).username = username;
    socket.join(room);
    console.log(`${username} joined room ${room}`);
  });

  socket.on("sendMessage", async ({ room, message }) => {
    io.to(room).emit("message", {
      username: (socket as any).username,
      text: message,
    });

    // Sauvegarder le message dans la base de données
    const newMessage = new Message({
      username: (socket as any).username,
      room,
      text: message,
    });

    try {
      await newMessage.save();
      console.log("Message saved in the database");
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

app.use(bodyParser.json());
app.use("/", routes);
app.use("/file", express.static("uploads"));

server.listen(3009, () => {
  console.log("server listening on port 3009");
});
