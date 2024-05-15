import React from "react";
import NavbarAccueil from "./NavbarAccueil";
import Corps from "./Corps";
import useStyles from "./styles";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import ProjectStore from "../../store/StoreProject";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import giphyImage from "../../assets/hi.gif";
import UserStore from "../../store/UserStore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      borderColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      color: "white !important",
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const Accueil = () => {
  const projectStore = ProjectStore();
  const hasProject = projectStore.project.name === "";
  const classes = useStyles();
  const userStore = UserStore();

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white", // Couleur du texte de la légende
        },
      },
      tooltip: {
        bodyColor: "white", // Couleur du texte dans les tooltips
      },
    },
  };
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
        <div className={classes.root}>
          <div>
            {/* <div className={classes.gif}>
              <img src={giphyImage} alt="hi" width="200px" />
            </div> */}
            <div className={classes.bienvenu}>
              <Typography className={classes.typographySalutation}>
                Bienvenue dans votre espace de gestion de projet !
              </Typography>
              <Typography className={classes.typographyInvitation}>
                Lancez-vous en créant votre premier projet. Invitez vos
                collègues, assignez des tâches et faites avancer vos projets
                vers le succès.
              </Typography>
            </div>
          </div>
          <div>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Accordéon 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Contenu du premier accordéon.</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>Accordéon 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Contenu du deuxième accordéon.</Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion disabled>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography>Accordéon 3 (désactivé)</Typography>
              </AccordionSummary>
            </Accordion>
          </div>
          {/* <div className={classes.tasks}>
            <div className={classes.tasksName}>
              <h4>tâches accomplies</h4>
              <h1>0</h1>
              <h4>Nombres de tâches</h4>
            </div>
            <div className={classes.tasksName}>
              <h4>tâches en cours</h4>
              <h1>0</h1>
              <h4>Nombres de tâches</h4>
            </div>
            <div className={classes.tasksName}>
              <h4>tâches en revue</h4>
              <h1>0</h1>
              <h4>Nombres de tâches</h4>
            </div>
            <div className={classes.tasksName}>
              <h4>Total des tâches</h4>
              <h1>0</h1>
              <h4>Nombres de tâches</h4>
            </div>
          </div>
          <div className={classes.nombresProjetsEquipes}>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className={classes.nombresProjets}
            >
              <div style={{ verticalAlign: "center" }}>
                <h2 style={{ color: "#FFFFFF" }}>Nombre de projet existant</h2>
                <h1 style={{ color: "#FFFFFF" }}>
                  {userStore.user.idProject.length} projet
                </h1>
              </div>
              <div className={classes.doughnut}>
                <Doughnut data={data} options={options} />
              </div>
            </div>
            <div
              style={{ display: "flex", alignItems: "center" }}
              className={classes.nombresEquipes}
            >
              <div style={{ verticalAlign: "center" }}>
                <h2 style={{ color: "#FFFFFF" }}>Nombre des équipes</h2>
                <h1 style={{ color: "#FFFFFF" }}>5 équipes</h1>
              </div>
              <div className={classes.pie}>
                <Pie data={data} options={options} />
              </div>
            </div>
          </div> */}

          {/* <div className={classes.doughnut}>
            <Doughnut data={data} />;
          </div>
          <div className={classes.pie}>
            <Pie data={data} />;
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Accueil;
