import React from "react";
import UserStore from "../../store/UserStore";
import { Avatar, TextField } from "@mui/material";
import configUrl from "../../utils";
import defaultImage from "../../assets/profil.png";
import useStyles from "./styles";

const MyProfil = () => {
  const userStore = UserStore();
  const handleClick = () => {};
  const classes = useStyles();
  return (
    <div>
      <Avatar
        className={classes.avatar}
        src={
          userStore.user.image
            ? `${configUrl.base_uri}/file/${userStore.user.image}`
            : defaultImage
        }
        alt="profile"
        onClick={handleClick}
        sx={{ cursor: "pointer", width: 150, height: 150 }}
      />
      <TextField value={userStore.user.username} className={classes.champs} />
      <TextField value={userStore.user.lastname} className={classes.champs} />
      <TextField value={userStore.user.firstname} className={classes.champs} />
    </div>
  );
};

export default MyProfil;
