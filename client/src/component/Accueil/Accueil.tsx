import React from "react";
import NavbarAccueil from "./NavbarAccueil";
import Corps from "./Corps";
import useStyles from "./styles";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import ProjectStore from "../../store/StoreProject";

const Accueil = () => {
  const projectStore = ProjectStore();
  const hasProject = projectStore.project.name === "";
  const classes = useStyles();
  return (
    <div>
      {!hasProject ? (
        <>
          <NavbarAccueil />
          <div className={classes.root}>
            <Corps />
          </div>
        </>
      ) : (
        <div style={{ display: "flex", backgroundColor: "#84c0ff" }}>
          <div className={classes.bienvenu}>
            <Typography
              variant="h5"
              color="textSecondary"
              className={classes.typography}
            >
              Bienvenue dans votre espace de gestion de projet !
            </Typography>
            <Typography
              variant="h5"
              color="textSecondary"
              className={classes.typography}
            >
              Lancez-vous en créant votre premier projet. Invitez vos collègues,
              assignez des tâches et faites avancer vos projets vers le succès.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accueil;
