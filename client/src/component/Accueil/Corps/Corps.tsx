import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import useStyles from "./styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import MyCard from "./MyCard";
import { TCard } from "../../../types/Card";
import { getAllCard } from "../../../api/card-api";
import { TColumn } from "../../../types/Column";
import DialogColumn from "./DialogColumn";
import { getAllColumn } from "../../../api/column-api";
import ProjectStore from "../../../store/StoreProject";
import socket from "../../../utils/socket";

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
};

const Corps = () => {
  const projectStore = ProjectStore();
  const classes = useStyles();
  const [card, setCard] = useState<TCard[] | []>([]);
  const [column, setColumn] = useState<TColumn[] | []>(
    projectStore.project.column
  );

  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [data, setData] = useState(defaultCard);
  const [dataColumn, setDataColumn] = useState(defaultColumn);
  const [idColumn, setIdColumn] = useState("");

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

  // useEffect(() => {
  //   getColumn();
  // }, []);

  useEffect(() => {
    setColumn(projectStore.project.column);
  }, [projectStore.project]);

  const addCard = (id: string) => {
    setIdColumn(id);
    setTitle("Créer une nouvelle carte");
    setMode("create");
    setData(defaultCard);
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

  return (
    <div className={classes.container}>
      <div>
        <div className={classes.columnContainer}>
          {column?.map((col: TColumn | any) => (
            <div className={classes.sousContainer}>
              <div className={classes.colName}>{col.name}</div>
              <div className={classes.column}>
                {/* Afficher les cartes dans la colonne actuelle */}
                {col?.cards?.map((card: any) => (
                  <Card className={classes.carte}>
                    <CardContent>
                      <Typography>Titre : {card.title}</Typography>
                      {/* <Typography>Description : {card.description}</Typography>
                      <Typography>Assigné à : {card.assignee}</Typography>
                      <Typography>Date limite : {card.dueDate}</Typography> */}
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="text"
                  color="default"
                  className={classes.plus}
                  onClick={() => addCard(col?._id)}
                >
                  + Ajouter une carte
                </Button>
              </div>
            </div>
          ))}
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
        />
      </div>
    </div>
  );
};

export default Corps;
