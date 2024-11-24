import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Card,
  CardContent,
} from "@material-ui/core";
import useStyles from "./styles";
import {
  getAllCard,
  updateCard,
  deleteCard,
  moveCard,
} from "../../../api/card-api";
import { getAllColumn, updateColumn } from "../../../api/column-api";
import ProjectStore from "../../../store/StoreProject";
import BacklogStore from "../../../store/BacklogStore";
import { getAllBacklog } from "../../../api/backlog-api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DOMPurify from "dompurify";
import DialogColumn from "./DialogColumn";
import MyCard from "./MyCard";
import { TCard } from "../../../types/Card";
import { TColumn } from "../../../types/Column";
import { TBacklog } from "../../../types/Backlog";
import { useTranslation } from "react-i18next";
import UserStore from "../../../store/UserStore";
import { Stepper, Step, StepLabel } from "@mui/material";
import { TSprint } from "../../../types/Sprint";
import { getAllSprint,updateSprintStatus } from "../../../api/sprint-api";
import SprintStore from "../../../store/SprintStore";
import { AnyMxRecord } from "dns";

const cleanHTML = (html: any) => {
  const sanitizedHTML = DOMPurify.sanitize(html);
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitizedHTML;
  const textContent = tempDiv.textContent || tempDiv.innerText || "";
  return textContent;
};

const defaultColumn: TColumn = {
  name: "",
  card: [],
};

const defaultCard: TCard = {
  title: "",
  description: "",
  attachment: "",
  assignee: "",
  startDate: "",
  dueDate: "",
  progress: "",
};

const Corps = () => {
  const navigate = useNavigate();
  const { idSprint } = useParams<{ idSprint: string }>(); 
  const projectStore = ProjectStore();
  const classes = useStyles();
  const [card, setCard] = useState<TCard[]>([]);
  const [column, setColumn] = useState<TColumn[]>(projectStore.project.column);
  const [columnsBySprint, setColumnsBySprint] = useState<{
    [sprintId: string]: TColumn[];
  }>({});
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);

  const backlogStore = BacklogStore();
  const userStore = UserStore();
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [backlogList, setBacklogList] = useState<{ result: TBacklog[] }>({
    result: [],
  });
  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [data, setData] = useState(defaultCard);
  const [dataColumn, setDataColumn] = useState(defaultColumn);
  const [idColumn, setIdColumn] = useState("");
  const [pourcentage, setPourcentage] = useState(0);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCard, setSelectedCard] = useState<null | TCard | any>(null);
  const [selectedColumn, setSelectedColumn] = useState<null | string>(null);
  const [selectedBacklog, setSelectedBacklog] = useState<null | TBacklog>(null);

  /*stepper */
  const [activeStep, setActiveStep] = useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newValue: string | any
  ) => {
    setSelectedSprintId(newValue);
    setActiveStep(newValue);
    console.log("stepActive:::", activeStep);
  };

  /*end stepper */
  const idProject = userStore.user.idProject[0];
  console.log("idProjectUSER", idProject);

  // const fetchSprint = async () => {
  //   try {
  //     const sprintData = await getAllSprint(idProject);
  //     SprintStore.getState().setListSprint(sprintData);
  //     setSprintList(sprintData);
  //   } catch (error) {
  //     console.error("Error fetching sprints:", error);
  //   }
  // };
  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(idProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
      console.log("Sprint Data:", sprintData);
      // Assurez-vous de récupérer également les colonnes pour chaque sprint
      const columnsData = await Promise.all(
        sprintData.result.map(async (sprint: TSprint | any) => {
          console.log("sprint id ::::", sprint.id);
          let idProject: any = userStore.user.idProject[0];
          let sprintId: any = sprint.id;
          const columns = await getAllColumn(idProject, sprintId); // Récupérez les colonnes ici selon le sprint
          console.log("columns sprint result", columns.result);
          return { sprintId: sprint._id, columns: columns.result };
        })
      );

      const columnsBySprint = columnsData.reduce(
        (acc: { [sprintId: string]: TColumn[] }, data) => {
          acc[data.sprintId] = data.columns;
          return acc;
        },
        {}
      );

      setColumnsBySprint(columnsBySprint);
      console.log("ColumnBySprint", columnsBySprint);
      console.log("selectedSprintId", selectedSprintId);

      if (idSprint) {
        const selectedSprint = sprintData.result.find((sprint: TSprint | any) => sprint._id === idSprint);
        if (selectedSprint) {
          setSelectedSprintId(idSprint);
          setActiveStep(sprintData.result.findIndex((sprint: TSprint | any) => sprint._id === idSprint));
        } else {
          console.warn(`Sprint with id ${idSprint} not found.`);
        }
      } else {
        // Sinon, recherchez le sprint "in-progress"
        const inProgressSprint = sprintData.result.find((sprint: TSprint |any) => sprint.status === "in-progress");

        if (inProgressSprint) {
          setSelectedSprintId(inProgressSprint._id);
          setActiveStep(sprintData.result.findIndex((sprint: TSprint | any) => sprint._id === inProgressSprint._id));
          navigate(`/accueil/${inProgressSprint._id}`);
        } else if (sprintData.result.length > 0) {
          // Sinon, sélectionnez le premier sprint par défaut
          setSelectedSprintId(sprintData.result[0]._id);
          navigate(`/accueil/${sprintData.result[0]._id}`);
        }
      }
    } catch (error) {
      console.error("Error fetching sprints and columns:", error);
    }
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: TCard | TBacklog,
    columnId: string
  ) => {
    setAnchorEl(event.currentTarget);
    if ("title" in item) {
      setSelectedCard(item);
      setSelectedBacklog(null);
    } else {
      setSelectedBacklog(item);
      setSelectedCard(null);
    }
    setSelectedColumn(columnId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCard(null);
    setSelectedColumn(null);
  };

  const getColumnIdByName = (columnName: any) => {
    const col = column.find((col: TColumn | any) => col.name === columnName);
    return col ? (col as any)._id : null;
  };

  const handleMoveCard = async (targetColumnName: any) => {
    try {
      // Vérifier si une carte et une colonne sélectionnées sont définies
      if (selectedCard && selectedColumn) {
        // Récupérer l'ID de la colonne cible à partir de son nom
        const targetColumnId = getColumnIdByName(targetColumnName);

        // Vérifier si l'ID de la colonne cible est défini
        if (targetColumnId) {
          // Appeler la fonction de déplacement de carte avec les ID appropriés
          const result: any = await moveCard(
            selectedCard._id,
            selectedColumn,
            targetColumnId
          );

          // Vérifier si le déplacement de la carte a réussi
          if (result.status === 200) {
            // Mettre à jour localement l'état des colonnes
            const updatedColumns = column.map((col: any) => {
              if (col._id === selectedColumn || col._id === targetColumnId) {
                // Mettre à jour les cartes dans les colonnes impliquées
                const updatedCards = col.cards.filter(
                  (cardId: any) => cardId !== selectedCard._id
                );
                return {
                  ...col,
                  cards: updatedCards,
                };
              }
              return col;
            });

            // Mettre à jour l'état local des colonnes
            setColumn(updatedColumns);

            // Fermer le menu contextuel après le déplacement de la carte
            handleMenuClose();
          } else {
            console.log("Erreur lors du déplacement de la carte");
          }
        } else {
          console.log(`Colonne cible "${targetColumnName}" non trouvée`);
        }
      } else {
        console.log("Carte ou colonne non sélectionnée");
      }
    } catch (error) {
      console.error("Erreur lors du déplacement de la carte:", error);
    }
  };

  const handleDeleteCard = async (e: any) => {
    e.preventDefault();
    if (selectedCard && selectedColumn) {
      await deleteCard(selectedCard._id);

      const updatedColumns = column.map((col: any) => {
        if (col._id === selectedColumn) {
          return {
            ...col,
            card: col.cards.filter(
              (cardId: any) => cardId !== selectedCard._id
            ),
          };
        }
        return col;
      });

      setColumn(updatedColumns);
      handleMenuClose();
    }
  };

  const getColumnStyles = (columnName: string) => {
    switch (columnName) {
      case "A faire":
        return {
          columnStyle: {},
          columnTitle: {},
          cardStyle: {
            backgroundColor: "#ecf2ff",
            paddingLeft: "5px",
            color: "#4b86ff",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            width: "100%",
          },
          cardButton: {},
          progress: classes.aFaire,
        };
      case "En cours":
        return {
          columnStyle: {},
          columnTitle: {},
          cardStyle: {
            backgroundColor: "#ffefe1",
            paddingLeft: "5px",
            color: "#f39c4a",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            width: "100%",
          },
          cardButton: {},
          progress: classes.enCours,
        };
      case "Code revue":
        return {
          columnStyle: {},
          columnTitle: {},
          cardStyle: {
            backgroundColor: "#feedff",
            paddingLeft: "5px",
            color: "#feedff",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            width: "50%",
          },
          cardButton: {},
          progress: classes.codeRevue,
        };
      case "Terminé":
        return {
          columnStyle: {},
          columnTitle: {},
          cardStyle: {
            backgroundColor: "#f1ecff",
            paddingLeft: "5px",
            color: "#7348e4",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            width: "50%",
          },
          cardButton: {},
          progress: classes.termine,
        };
      default:
        return {
          columnStyle: {},
          columnTitle: {},
          cardStyle: {
            backgroundColor: "#f1ecff",
            paddingLeft: "5px",
            color: "#7348e4",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
          },
          cardButton: {},
        };
    }
  };

  const handlePourcentageChange = (event: any) => {
    const value = event.target.value;
    setPourcentage(value);
  };

  // const getColumn = async () => {
  //   const result = await getAllColumn();
  //   setColumn(result);
  //   if (result) {
  //     setColumn(result.result);
  //   }
  // };

  const getCard = async () => {
    const result = await getAllCard();
    setCard(result);
    if (result) {
      setCard(result.result);
    }
  };

  const handleSubmitComment = (comment: string) => {
    console.log("Comment submitted:", comment);
  };

  const fetchBacklogs = async () => {
    try {
      const backlogData = await getAllBacklog(idProject);
      BacklogStore.getState().setListBacklog(backlogData);
      setBacklogList(backlogData);
    } catch (error) {
      console.error("Error fetching backlog:", error);
    }
  };

  useEffect(() => {
    if (idProject) {
      fetchBacklogs();
      fetchSprint();
    }
  }, [idProject]);

  useEffect(() => {
    if (projectStore.project) setColumn(projectStore.project.column);
  }, [projectStore.project]);

  useEffect(() => {
    if (selectedSprintId) {
      // Mettre à jour les colonnes pour le sprint sélectionné
      setColumn(columnsBySprint[selectedSprintId] || []);
    }
  }, [selectedSprintId, columnsBySprint]);
  
// Vous pouvez aussi ajouter cet effet pour réagir à l'idSprint de l'URL :
  useEffect(() => {
    if (idSprint) {
      setSelectedSprintId(idSprint); // Mettre à jour le sprint sélectionné
    }
  }, [idSprint]);
  const addCard = (id: string) => {
    setIdColumn(id);
    setTitle("Créer une nouvelle carte");
    setMode("create");
    setData(defaultCard);
    setOpenCardDialog(!openCardDialog);
  };

  const updateCardInformation = (id: string, title: string, card: TCard) => {
    setIdColumn(id);
    setTitle(title);
    setMode("update");
    setData(card);
    setOpenCardDialog(!openCardDialog);
  };

  const handleCloseDialog = () => {
    setOpenColumnDialog(!openColumnDialog);
  };

  const handleCloseDialogCard = () => {
    setOpenCardDialog(!openCardDialog);
    if (openCardDialog) {
      setIdColumn("");
    }
  };
  const handleNext = async() => {
    if (activeStep < sprintList.result.length - 1) {
     
      const currentSprintId = (sprintList as any).result[activeStep]._id;
      const nextSprintId = (sprintList as any).result[activeStep + 1]._id;

      setActiveStep((prev) => prev + 1);
      setSelectedSprintId(nextSprintId);
      navigate(`/accueil/${nextSprintId}`);
      try {
        // Met à jour le statut du sprint actuel à "in-progress" et l'étape précédente à "completed"
        await updateSprintStatus(idProject, currentSprintId, "completed");
        await updateSprintStatus(idProject, nextSprintId, "in-progress");
  
        console.log("Sprint avancé avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du sprint", error);
      }
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      const previousSprintId = (sprintList as any).result[activeStep - 1]._id;
      setActiveStep((prev) => prev - 1);
      setSelectedSprintId(previousSprintId);
      navigate(`/accueil/${previousSprintId}`); // Met à jour l'URL avec le sprint précédent
    }
  };

  return (
    <div>
      <div style={{ marginTop: "75px", background: "#f2f6fe" }}>
        <Stepper activeStep={activeStep}>
          {(sprintList as any).result.map((sprint: any, e: any, index: any) => (
            <Step key={sprint._id}>
              <StepLabel
                onClick={() => handleTabChange(e, sprint._id)}
                className={classes.stepIcon}
              >
                {sprint.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        {userStore.user.role?.name == "SCRUM MANAGER" && (
          <div
            style={{ display: "flex", marginTop: "20px", marginLeft: "20px" }}
          >
            <Button
              variant="contained"
            
              onClick={handlePrevious}
              disabled={activeStep === 0}
              style={{ marginRight: "20px", padding: "7px", background:"#ecf2ff" }}
            >
              Sprint precedent
            </Button>
            <Button
              variant="contained"
              
              onClick={handleNext}
              disabled={activeStep === sprintList.result.length - 1}
              style={{ padding: "7px" , background:"#f50057", color:"#fff"}}
            >
              Passer au sprint suivant
            </Button>
          </div>
        )}

        {/* Affichage des colonnes pour le sprint sélectionné */}
        {selectedSprintId && columnsBySprint[selectedSprintId] && (
          <div className={classes.container}>
            <div className={classes.columnContainer}>
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className={classes.column}
              >
                <div
                  className={classes.colName}
                  // style={{ backgroundColor: "green" }}
                >
                  Backlogs
                </div>
                <div>
                  {backlogList.result.map((backlog: TBacklog | any, index) => (
                    <div key={index} className={classes.backlog}>
                      <Card
                        style={{
                          cursor: "pointer",
                          boxShadow: "none",
                          width: "100%",
                        }}
                      >
                        <CardContent>
                          <Typography className={classes.valueCard}>
                            <span style={{ color: "#506268" }}>Tâche</span>
                            <span style={{ color: "black" }}>
                              {backlog.task}
                            </span>
                          </Typography>
                          <Typography className={classes.valueCard}>
                            <span style={{ color: "#506268" }}>Priorité</span>
                            <span style={{ color: "black" }}>
                              {backlog.priority}
                            </span>
                          </Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              {columnsBySprint[selectedSprintId].map((col: TColumn | any) => {
                const {
                  columnStyle,
                  columnTitle,
                  cardStyle,
                  cardButton,
                  progress,
                } = getColumnStyles(col.name);
                return (
                  <div key={col._id}>
                    <div className={classes.column}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className={classes.colName}
                          style={{ ...columnTitle }}
                        >
                          {col.name}
                        </div>
                        {userStore.user.role?.name == "SCRUM MANAGER" && (
                          <div>
                            <button
                              className={classes.plus}
                              style={{ ...cardButton }}
                              onClick={() => addCard(col?._id)}
                              title="Ajouter carte"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>

                      <div style={{ ...columnStyle }}>
                        {col?.cards?.map((card: TCard | any, index: number) => (
                          <div key={card._id} className={classes.carte}>
                            <Card
                              onClick={() =>
                                updateCardInformation(
                                  col?._id,
                                  card.title,
                                  card
                                )
                              }
                              style={{
                                cursor: "pointer",
                                boxShadow: "none",
                                width:'300px'
                              }}
                            >
                              <CardContent style={{ width: "100%" }}>
                                <Typography
                                  className={classes.valueCard}
                                  style={{ width: "100%" }}
                                >
                                  <span
                                    style={{
                                      textAlign: "center",
                                      ...cardStyle,
                                    }}
                                  >
                                    {card.title}
                                  </span>
                                </Typography>
                                <Typography
                                  className={classes.valueCardContent}
                                  style={{ width: "100%" }}
                                >
                                  <span style={{ color: "#506268" }}>
                                    Description
                                  </span>
                                  <span>{cleanHTML(card.description)}</span>
                                </Typography>
                                <Typography
                                  className={classes.valueCardContent}
                                  style={{ width: "100%" }}
                                >
                                  <span style={{ color: "#506268" }}>
                                    Assigné à
                                  </span>
                                  <span>{card.assignee.email}</span>
                                </Typography>
                                <Typography
                                  className={classes.valueCardContent}
                                  style={{ width: "100%" }}
                                >
                                  <span style={{ color: "#506268" }}>
                                    Date limite
                                  </span>
                                  <span>{card.dueDate}</span>
                                </Typography>
                                <LinearProgress
                                  className={`${classes.valueProgress} ${progress}`}
                                  variant="determinate"
                                  value={card.progress}
                                  style={{ width: "100%" }}
                                />
                              </CardContent>
                            </Card>
                            <div
                              style={{ background: "#fff" }}
                              className={classes.cardModif}
                            >
                              <IconButton
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                onClick={(event) =>
                                  handleMenuOpen(event, card, col._id)
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <DialogColumn
        column={column}
        open={openColumnDialog}
        handleClose={handleCloseDialog}
        data={dataColumn}
        projectName={projectStore.project.name}
      />
      <MyCard
        card={card}
        open={openCardDialog}
        handleClose={handleCloseDialogCard}
        title={title}
        mode={mode}
        data={data}
        trigger={getCard}
        idColumn={idColumn}
        placeholder=""
        onSubmitComment={handleSubmitComment}
      />
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMoveCard("A faire")}>
          Déplacer vers A faire
        </MenuItem>
        <MenuItem onClick={() => handleMoveCard("En cours")}>
          Déplacer vers En cours
        </MenuItem>
        <MenuItem onClick={() => handleMoveCard("En retard")}>
          Déplacer vers En retard
        </MenuItem>
        <MenuItem onClick={() => handleMoveCard("Terminé")}>
          Déplacer vers Terminé
        </MenuItem>
        <MenuItem onClick={handleDeleteCard}>Supprimer</MenuItem>
      </Menu>
    </div>
  );
};


export default Corps;

