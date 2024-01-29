import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NotificationsIcon from "@mui/icons-material/Notifications";
//import MailOutlineIcon from "@mui/icons-material/MailOutline";
import MessageIcon from "@mui/icons-material/Message";
import { ClassNames } from "@emotion/react";
import useStyles from "./styles";
import { getMe } from "../../api/user-api";
import socket from "../../utils/socket";
import { useEffect, useState } from "react";
import { Badge } from "@mui/material";
import { lengthNotification } from "../../api/notification-api";
import NotificationStore from "../../store/NotificationStore";
import UserStore from "../../store/UserStore";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import logo from "../../assets/manage.png";

const pages = [
  { text: "ACCUEIL", href: "/accueil" },
  { text: "ABOUT", href: "/about" },
  { text: "PROJECTS", href: "/projects" },
];

const Header = () => {
  const classes = useStyles();
  const { notifLength } = NotificationStore();
  const [notif, setNotif] = useState(notifLength);
  const [anchorEl, setAnchorEl] = useState(null);

  const userStore = UserStore();
  const sendNotification = () => {
    console.log("test notif");
    socket.emit("send_notification", {
      message: "test",
      project: "65a253180fb55b3b8addd08a",
    });
  };

  const getNotifLength = async () => {
    setNotif(await lengthNotification());
  };

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Mettez ici la logique de déconnexion
    handleClose();
  };

  useEffect(() => {
    const GetMe = async () => {
      await getMe();
    };
    getNotifLength();
    GetMe();
  }, []);

  useEffect(() => {
    socket.on("receive_notification", (data) => {
      getNotifLength();
    });
  }, [socket]);

  useEffect(() => {
    setNotif(notifLength);
  }, [notifLength]);

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Container maxWidth="xl">
          <Toolbar style={{ display: "flex" }}>
            {/* Logo */}
            <img
              src="/chemin/vers/votre/logo.png" // Remplacez par le chemin réel de votre logo
              alt="Mon Logo"
              style={{ width: "50px", marginRight: "10px" }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
              }}
            >
              {/* Bouton de notification */}
              <Badge badgeContent={notif} color="error">
                <NotificationsIcon />
              </Badge>

              {/* Bouton de messagerie */}
              <IconButton
                size="large"
                color="inherit"
                aria-label="messagerie"
                style={{ width: "40px", marginLeft: "10px" }}
                onClick={sendNotification}
              >
                <MessageIcon />
              </IconButton>
            </div>
            <div style={{ marginRight: "1rem" }}>
              <h3>Hi , {userStore.user.username}</h3>
            </div>
            {/* <div>
              <Avatar
                src="chemin/vers/votre/photo-de-profil.jpg"
                alt="Votre photo de profil"
                onClick={handleClick}
                sx={{ cursor: "pointer" }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Mon Compte</MenuItem>
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </div> */}
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Header;
