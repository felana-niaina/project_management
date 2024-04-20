import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { inject, observer } from "mobx-react";
// import { MessageStoreInterface } from "../../store/MessageStore";
import moment from "moment";
import React, { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { TMessage } from "../../types/Message";
import { getAllMessage } from "../../api/message-api";
import { getAllUser } from "../../api/user-api";
import { TUser } from "../../types/User";
import configUrl from "../../utils";

const Chat = ({
  isOpen,
  onClose,
  username,
  room,
}: {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  room: string;
}) => {
  const [messages, setMessages] = useState<TMessage[] | []>([]);
  const [messageInput, setMessageInput] = useState("");
  const [getUsers, setGetUsers] = useState<TUser[] | []>([]);
  const closeChat = () => {
    onClose();
  };
  useEffect(() => {
    if (isOpen) {
      socket.emit("joinRoom", { username, room });

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("message");
      };
    }
  }, [isOpen, username, room]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await getAllUser();
      setGetUsers(users.result);
      console.log("all users :::", users);
    };

    getUsers();
  }, []);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      socket.emit("sendMessage", { room, message: messageInput });
      setMessageInput("");
    }
  };

  return (
    <Paper
      elevation={3}
      style={{
        zIndex: 2,
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "25rem",
        height: isOpen ? " 35rem" : "0",
        overflow: "hidden",
        transition: "height 0.3s ease-in-out",
      }}
      id="paperChat"
    >
      <Grid
        style={{
          display: "flex",
          justifyContent: "right",
          textAlign: "end",
        }}
      >
        <Button
          style={{
            fontSize: "20px",
            padding: "12px",
          }}
          onClick={closeChat}
        >
          X
        </Button>
      </Grid>

      <Box p={2}>
        <Typography variant="h6">Chat</Typography>
        <div style={{ display: "flex", gap: 5 }}>
          {getUsers.map((users) => (
            <div>
              <img
                src={`${configUrl.base_uri}/file/${users.image}`}
                alt={`${users.image}`}
                width={50}
                height={50}
                style={{ borderRadius: "50%" }}
              />
              {users.isConnected && (
                <span
                  style={{
                    display: "block",
                    width: "10px",
                    backgroundColor: "green",
                    height: "10px",
                    position: "relative",
                    top: "-15px",
                    borderRadius: "50%",
                  }}
                />
              )}

              <span>{users.lastname}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            height: "200px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
        >
          {messages.map((message, index) => (
            <Typography key={index} variant="body1">
              {message.username}: {message.text}
            </Typography>
          ))}
        </div>
        <TextField
          fullWidth
          label="Message"
          variant="outlined"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "10px" }}
          onClick={sendMessage}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default Chat;
