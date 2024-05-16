import React, { useEffect, useState } from "react";
import NavbarAccueil from "./NavbarAccueil";
import Corps from "./Corps";
import useStyles from "./styles";
import Typography from "@mui/material/Typography";
import ProjectStore from "../../store/StoreProject";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { getAllColumn } from "../../api/column-api";
import { TProject } from "../../types/Project";
import { TColumn } from "../../types/Column";

const Accueil = () => {
  const projectStore = ProjectStore();
  const hasProject = projectStore.project.name === "";
  const classes = useStyles();
  const [columns, setColumns] = useState<{ [projectId: string]: TColumn[] }>(
    {}
  );
  const [expanded, setExpanded] = useState<number | false>(false);
  useEffect(() => {
    async function fetchColumns() {
      const columnsData: { [projectId: string]: TColumn[] } = {};
      for (const project of projectStore.listProject as TProject[] | any) {
        try {
          const columns = await getAllColumn(project._id);
          console.log("columns:::::", columns);

          columnsData[project._id] = columns;
        } catch (error) {
          console.error(
            `Error fetching columns for project ${project._id}:`,
            error
          );
        }
      }
      setColumns(columnsData);
      console.log("columnsDAta :::", columnsData);
    }

    if (projectStore.listProject.length > 0) {
      fetchColumns();
    }
  }, [projectStore.listProject]);

  const handleChange =
    (panel: number) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  console.log("Type of columns:", columns);
  {
    console.log("Columns:", columns);
  }
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
          <Card
            style={{
              marginBottom: "10px",
              marginLeft: "32px",
              marginRight: "32px",
            }}
          >
            {/* <CardContent>
              <Typography gutterBottom style={{ fontSize: "1rem" }}>
                Test
              </Typography>
            </CardContent> */}
          </Card>
          <div style={{ marginBottom: "10px" }}>
            {projectStore.listProject.map((project: TProject | any) => (
              <Accordion
                key={project._id}
                style={{
                  marginBottom: "10px",
                  marginLeft: "32px",
                  marginRight: "32px",
                }}
                expanded={expanded === project._id}
                onChange={handleChange(project._id)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${project._id}-content`}
                  id={`panel${project._id}-header`}
                >
                  <Typography>{project.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className={classes.details}>
                    {columns[project._id] &&
                      (columns[project._id] as any).result
                        .filter((column: any) =>
                          [
                            "A faire",
                            "En cours",
                            "Code revue",
                            "Terminé",
                          ].includes(column.name)
                        )
                        .map((filteredColumn: any) => {
                          console.log("Filtered Column:", filteredColumn);
                          return (
                            <div key={filteredColumn._id}>
                              <div className={classes.tasksName}>
                                <h4>{filteredColumn.name}</h4>
                                <h1>
                                  {filteredColumn.cards
                                    ? filteredColumn.cards.length
                                    : 0}
                                </h1>
                                <h4>Nombres de cartes</h4>
                              </div>
                            </div>
                          );
                        })}
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Accueil;
