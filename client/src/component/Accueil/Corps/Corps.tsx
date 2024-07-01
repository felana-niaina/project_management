import React, { useState, useEffect } from "react";
import { Button, LinearProgress, TextField } from "@material-ui/core";
import useStyles from "./styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import MyCard from "./MyCard";
import { TCard } from "../../../types/Card";
import { getAllCard, updateCard } from "../../../api/card-api";
import { TColumn } from "../../../types/Column";
import DialogColumn from "./DialogColumn";
import { getAllColumn } from "../../../api/column-api";
import ProjectStore from "../../../store/StoreProject";
import socket from "../../../utils/socket";
import Rating from "@mui/material/Rating";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import BacklogStore from "../../../store/BacklogStore";
import { TBacklog } from "../../../types/Backlog";
import { getAllBacklog } from "../../../api/backlog-api";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const cleanHTML = (html: any) => {
  // Assainir le HTML
  const sanitizedHTML = DOMPurify.sanitize(html);

  // Créer un élément div temporaire pour manipuler le HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitizedHTML;

  // Extraire le texte sans balises
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
  dueDate: "",
  progress: "",
};

const Corps = () => {
  const projectStore = ProjectStore();
  const classes = useStyles();
  const [card, setCard] = useState<TCard[] | []>([]);
  const [column, setColumn] = useState<TColumn[] | []>(
    projectStore.project.column
  );
  // console.log("11111111111111", projectStore.project);
  const backlogStore = BacklogStore();
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
  const getColumnStyles = (columnName: string) => {
    switch (columnName) {
      case "A faire":
        return {
          columnStyle: { border: "2px solid #DEE3E0" },
          columnTitle: { backgroundColor: "#e02b81" },
          cardStyle: { backgroundColor: "#f2e1ea" },
          cardButton: { backgroundColor: "#e02b81" },
          progress: classes.aFaire,
        };
      case "En cours":
        return {
          columnStyle: { border: "2px solid #DEE3E0" },
          columnTitle: { backgroundColor: "#36c5f1" },
          cardStyle: { backgroundColor: "#cee3e9" },
          cardButton: { backgroundColor: "#36c5f1" },
          progress: classes.enCours,
        };

      case "Code revue":
        return {
          columnStyle: { border: "2px solid #DEE3E0" },
          columnTitle: { backgroundColor: "#360845" },
          cardStyle: { backgroundColor: "#d1bfd7" },
          cardButton: { backgroundColor: "#360845" },
          progress: classes.codeRevue,
        };

      case "Terminé":
        return {
          columnStyle: { border: "2px solid #DEE3E0" },
          columnTitle: { backgroundColor: "#f0c536" },
          cardStyle: { backgroundColor: "#f3e5b6" },
          cardButton: { backgroundColor: "#f0c536" },
          progress: classes.termine,
        };

      default:
        return {
          columnStyle: { border: "2px solid #DEE3E0" },
          columnTitle: { backgroundColor: "rgb(0,128,64)" },
          cardStyle: { backgroundColor: "rgb(121,255,188)" },
          cardButton: { backgroundColor: "rgb(0,128,64)" },
        };
    }
  };

  const handlePourcentageChange = (event: any) => {
    const value = event.target.value;
    setPourcentage(value);
  };
  const getColumn = async () => {
    const result = await getAllColumn();
    setColumn(result);
    if (result) {
      setColumn(result.result);
    }
  };

  const getCard = async () => {
    const result = await getAllCard();
    setCard(result);
    if (result) {
      setCard(result.result);
    }
  };
  const handleSubmitComment = (comment: string) => {
    // Logique de soumission du commentaire, par exemple :
    console.log("Comment submitted:", comment);
    // Ici, vous pouvez appeler votre API pour soumettre le commentaire, etc.
  };
  // useEffect(() => {
  //   getColumn();
  // }, []);
  const idProject = localStorage.getItem("Project_id");

  const fetchBacklogs = async () => {
    try {
      const backlogData = await getAllBacklog(idProject);
      BacklogStore.getState().setListBacklog(backlogData);
      setBacklogList(backlogData);
      console.log("Backlog data:", backlogData);
    } catch (error) {
      console.error("Error fetching backlog:", error);
    }
  };

  useEffect(() => {
    if (idProject) {
      fetchBacklogs();
    }
  }, [idProject]);

  useEffect(() => {
    // console.log("22222222222", projectStore);
    if (projectStore.project) setColumn(projectStore.project.column);
    // console.log("useEffect ..............................................");
  }, [projectStore.project]);

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColumnIndex = column.findIndex(column => column.name === source.droppableId);
    const destinationColumnIndex = column.findIndex(column => column.name === destination.droppableId);

    if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return;

    const sourceColumn = column[sourceColumnIndex];
    const destinationColumn = column[destinationColumnIndex];

    if (!sourceColumn.card || !destinationColumn.card) return;

    // Clone the cards arrays
    const sourceCards = Array.from(sourceColumn.card);
    const destinationCards = Array.from(destinationColumn.card);

    const [removed] = sourceCards.splice(source.index, 1);
    destinationCards.splice(destination.index, 0, removed);

    const newColumns = [...column];
    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      card: sourceCards,
    };
    newColumns[destinationColumnIndex] = {
      ...destinationColumn,
      card: destinationCards,
    };

    setColumn(newColumns);
  };
  
  
  console.log("Backlog list:", backlogList);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={classes.container}>
        <div className={classes.columnContainer}>
          <Droppable droppableId="backlogList">
            {(provided, snapshot) => (
              <div
                style={{ display: "flex", flexDirection: "column" }}
                className={`${classes.column} ${
                  snapshot.isDraggingOver ? "isDraggingOver" : ""
                }`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <div
                  className={classes.colName}
                  style={{ backgroundColor: "green" }}
                >
                  Backlogs
                </div>

                {backlogList.result.map((backlog: TBacklog | any, index) => (
                  <Draggable
                    key={backlog._id}
                    draggableId={backlog.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? "isDragging" : ""}
                      >
                        <Card className={classes.carte}>
                          <CardContent>
                            <Typography>Tâche : {backlog.task} </Typography>
                            <Typography>
                              Assigné à : {backlog.priority}{" "}
                            </Typography>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {column?.map((col: TColumn | any, colIndex) => {
            const {
              columnStyle,
              columnTitle,
              cardStyle,
              cardButton,
              progress,
            } = getColumnStyles(col?.name);
            return (
              <Droppable droppableId={col.name} key={colIndex}>
                {(provided, snapshot) => (
                  <div
                    className={classes.column}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <div className={classes.colName} style={{ ...columnTitle }}>
                      {col.name}
                    </div>
                    {/* Afficher les cartes dans la colonne actuelle */}
                    <div style={{ ...columnStyle }}>
                      {col?.cards?.map((card: any, index: any) => (
                        <Draggable
                          draggableId={card._id.toString()}
                          index={index}
                          key={card._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card
                                className={classes.carte}
                                onClick={() =>
                                  updateCardInformation(
                                    col?._id,
                                    card.title,
                                    card
                                  )
                                }
                                style={{ cursor: "pointer", ...cardStyle }}
                              >
                                <CardContent>
                                  <Typography className={classes.valueCard}>
                                    Titre : {card.title}
                                  </Typography>


                                  <Typography
                                    className={classes.valueCardContent}
                                  >
                                    Description : {cleanHTML(card.description)}
                                  </Typography>
                                  <Typography
                                    className={classes.valueCardContent}
                                  >
                                    Assigné à : {card.assignee}
                                  </Typography>
                                  <Typography
                                    className={classes.valueCardContent}
                                  >
                                    Date limite : {card.dueDate}
                                  </Typography>
                                  <LinearProgress
                                    className={`${classes.valueProgress} ${progress}`}
                                    variant="determinate"
                                    value={card.progress}
                                  />
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <Button
                        variant="text"
                        className={classes.plus}
                        style={{ ...cardButton }}
                        onClick={() => addCard(col?._id)}
                      >
                        + {t("addCard")}
                      </Button>
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
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
          placeholder="hi felana"
          onSubmitComment={handleSubmitComment}
        />
      </div>
    </DragDropContext>
  );
};

export default Corps;
