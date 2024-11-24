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
import {
  lengthNotification,
  getUpcomingSprintsNotifications,
} from "../../api/notification-api";
import NotificationStore from "../../store/NotificationStore";
import UserStore from "../../store/UserStore";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import logo from "../../assets/manage.png";
import { TUser } from "../../types/User";
import configUrl from "../../utils";
import defaultImage from "../../assets/profil.png";
import Chat from "../../component/Chat";
import { useTranslation } from "react-i18next";
import projectPlanner from "../../assets/myLogoPlanifieo.png";
import { Link } from "react-router-dom";
import { getCardBySearch } from "../../api/search-api";
import { TNotification } from "../../types/Notification";
import LanguageSelector from "../../component/LanguageSelector";

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
  const idProjectUser = userStore.user.idProject[0];
  console.log("idProjectHeader", idProjectUser);
  const getNotifLength = async () => {
    setNotif((await (lengthNotification(idProjectUser) as any)).count);
    setListNotification(
      (await (lengthNotification(idProjectUser) as any)).notification
    );
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

  // // It is a hook imported from 'react-i18next'
  // const { t, i18n } = useTranslation();

  // const changeLanguage = (lng: string) => {
  //   i18n
  //     .changeLanguage(lng)
  //     .then(() => {
  //       console.log(`Langue changée en ${lng}`);
  //     })
  //     .catch((error) => {
  //       console.error("Erreur lors du changement de langue :", error);
  //     });
  // };
  // const [lang, setLang] = useState("en");

  // This function put query that helps to
  // change the language
  // const handleChange = (e: any) => {
  //   setLang(e.target.value);
  //   const loc = window.location.pathname;
  //   window.location.replace(loc + "?lng=" + e.target.value);
  // };
  const handleLogoClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Project_name");
    localStorage.removeItem("Project_id");
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
    console.log("notif length", notif);
  }, [socket]);

  useEffect(() => {
    setNotif(notifLength);
  }, [notifLength]);

  return (
    <div>
      <AppBar
        position="relative"
        style={{ background: "#f2f6fe" }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar style={{ display: "flex" }}>
            {/* Logo */}
            {/* <Link to="/accueil" onClick={handleLogoClick}>
              <img
                src={projectPlanner}
                alt="Mon Logo"
                style={{ width: "100px", marginRight: "7rem" }}
              />
            </Link> */}

            {/* <Grid className={classes.home}>
              <HomeIcon />
            </Grid> */}
            <TextField
              className={classes.search}
              label="Rechercher ici..."
              variant="outlined"
              value={searchQuery}
              onChange={handleSearch}
            
              InputProps={{
                style: {
                  // height: "40px",
                  // width: "400px",
                  borderRadius: "50px",
                  background: "#fff",
                },
                classes: {
                  input: classes.noRing, // Apply the noRing class to the input element
                },
                endAdornment: (
                  <IconButton edge="end" style={{ color: "#1e0059" }}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />

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
                  <NotificationsIcon style={{ color: "#1e0059" }} />
                </span>
              </Badge>

              <Menu
                anchorEl={anchorEl2}
                open={Boolean(anchorEl2)}
                onClose={handleClose}
                style={{ padding: "1.5rem" }}
              >
                <div className={classes.notifContent}>
                  {listNotification?.map((item: any) => (
                    <Typography> {item.message} </Typography>
                  ))}
                </div>
              </Menu>

              {/* Bouton de messagerie */}
              <IconButton
                size="large"
                aria-label="messagerie"
                style={{ width: "40px", marginLeft: "10px", color: "#1e0059" }}
                onClick={() => openChat("une_salle")}
              >
                <MessageIcon />
              </IconButton>
            </div>
            {/* <LanguageSelector /> */}
            <div style={{ marginRight: "1rem", color: "#1e0059" }}>
              <h3>Bonjour , {userStore.user.username}</h3>
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
                {/* <MenuItem onClick={() => history("/myProfil")}>
                  Mon Compte
                </MenuItem> */}
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
