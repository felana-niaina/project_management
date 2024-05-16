import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { loggOut } from "../../api/auth-api";
import { useNavigate } from "react-router-dom";
//import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import { ClassNames } from "@emotion/react";
import useStyles from "./styles";
import { getMe } from "../../api/user-api";
import socket from "../../utils/socket";
import { useEffect, useState } from "react";
import { Badge, Grid, TextField } from "@mui/material";
import { lengthNotification } from "../../api/notification-api";
import NotificationStore from "../../store/NotificationStore";
import UserStore from "../../store/UserStore";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import logo from "../../assets/manage.png";
import { TUser } from "../../types/User";
import configUrl from "../../utils";
import defaultImage from "../../assets/profil.png";
import Chat from "../../component/Chat";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import projectPlanner from "../../assets/myLogoPlanifieo.png";
import { Link } from "react-router-dom";
import { getCardBySearch } from "../../api/search-api";
import { TNotification } from "../../types/Notification";

const pages = [
  { text: "ACCUEIL", href: "/accueil" },
  { text: "ABOUT", href: "/about" },
  { text: "PROJECTS", href: "/projects" },
];
const languages = [
  { value: "", text: "Options" },
  { value: "en", text: "English" },
  { value: "fr", text: "French" },
  { value: "de", text: "German" },
];

const Header = () => {
  const classes = useStyles();
  const { notifLength } = NotificationStore();
  const [notif, setNotif] = useState(notifLength);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [listNotification, setListNotification] = useState([]);

  const userStore = UserStore();

  // const sendNotification = () => {
  //   console.log("test notif");
  //   socket.emit("send_notification", {
  //     message: "test",
  //     project: currentProject,
  //   });
  // };

  const handleSearch = async (e: any) => {
    const { value } = e.target;
    setSearchQuery(value);
    if (value != null) {
      await getCardBySearch(value);
    }
  };

  const history = useNavigate();

  const showNotif = (e: any) => {
    setAnchorEl2(e.currentTarget);
  };

  const getNotifLength = async () => {
    setNotif((await (lengthNotification() as any)).count);
    setListNotification((await (lengthNotification() as any)).notification);
  };

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    await loggOut();
    history("/");
  };

  const openChat = (room: string) => {
    setSelectedRoom(room); // Mettre à jour la salle sélectionnée
    setIsChatOpen(true);
    setIsChatOpen(true);
  };

  // It is a hook imported from 'react-i18next'
  const { t } = useTranslation();

  const [lang, setLang] = useState("en");

  // This function put query that helps to
  // change the language
  const handleChange = (e: any) => {
    setLang(e.target.value);
    const loc = window.location.pathname;
    window.location.replace(loc + "?lng=" + e.target.value);
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
      <AppBar
        position="fixed"
        style={{ background: "#080912", border: "2px solid #1F2937" }}
      >
        <Container maxWidth="xl">
          <Toolbar style={{ display: "flex" }}>
            {/* Logo */}
            <Link to="/accueil">
              <img
                src={projectPlanner}
                alt="Mon Logo"
                style={{ width: "100px", marginRight: "7rem" }}
              />
            </Link>

            {/* <Grid className={classes.home}>
              <HomeIcon />
            </Grid> */}
            <TextField
              className={classes.search}
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                style: { height: "40px", width: "400px" },
                endAdornment: (
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
            <div id="google_translate_element"></div>
            {/* <select value={lang} onChange={handleChange}>
              {languages.map((item) => {
                return (
                  <option key={item.value} value={item.value}>
                    {item.text}
                  </option>
                );
              })}
            </select> */}
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
                <span onClick={showNotif}>
                  <NotificationsIcon />
                </span>
              </Badge>

              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose}
              >
                {listNotification?.map((item: any) => (
                  <Typography> {item.message} </Typography>
                ))}
              </Menu>

              {/* Bouton de messagerie */}
              <IconButton
                size="large"
                color="inherit"
                aria-label="messagerie"
                style={{ width: "40px", marginLeft: "10px" }}
                onClick={() => openChat("une_salle")}
              >
                <MessageIcon />
              </IconButton>
            </div>
            <div style={{ marginRight: "1rem" }}>
              <h3>Hi , {userStore.user.username}</h3>
            </div>
            <div>
              <Avatar
                src={
                  userStore.user.image
                    ? `${configUrl.base_uri}/file/${userStore.user.image}`
                    : defaultImage
                }
                alt="profile"
                onClick={handleClick}
                sx={{ cursor: "pointer", width: 45, height: 45 }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => history("/myProfil")}>
                  Mon Compte
                </MenuItem>
                <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {isChatOpen && (
        <Chat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          username={userStore.user.username}
          room="une_salle"
        />
      )}
    </div>
  );
};

export default Header;
