import { TCard } from "../../../../types/Card";
import { FC, useState, useEffect } from "react";
import { createCard, updateCard, deleteCard } from "../../../../api/card-api";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import { getSelectedProject } from "../../../../api/project-api";
import socket from "../../../../utils/socket";

type TProps = {
  card: TCard | any;
  open: boolean;
  handleClose: () => void;
  title: string;
  mode: string;
  data: TCard | any;
  trigger: () => void;
  idColumn: string;
};

const MyCard: FC<TProps> = ({
  card,
  open,
  handleClose,
  title,
  mode,
  data,
  trigger,
  idColumn,
}) => {
  const [newCard, setNewCard] = useState(data);

  useEffect(() => {
    setNewCard({ ...data });
  }, [data]);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setNewCard({ ...newCard, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    mode === "create"
      ? await createCard(newCard, idColumn)
      : await updateCard(newCard, idColumn);
    trigger();
    await getSelectedProject();
    handleClose();

    const projectId = localStorage.getItem("Project_id");

    if (projectId) {
      socket.emit("send_notification", {
        message: "notif carte",
        project: projectId,
      });
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    await deleteCard(newCard._id);
    trigger();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Titre"
                required
                value={newCard.title}
                onChange={handleFormChange}
                name="title"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextareaAutosize
                minRows={3}
                placeholder="Description"
                value={newCard.description}
                onChange={handleFormChange}
                name="description"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Joindre fichier"
                type="file"
                onChange={handleFormChange}
                value={newCard.attachment}
                name="lastname"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Assigné à"
                required
                onChange={handleFormChange}
                value={newCard.assignee}
                name="assignee"
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Date limite"
                type="date"
                required
                onChange={handleFormChange}
                value={newCard.dueDate}
                name="dueDate"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
              >
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {mode === "create" ? "Create" : "update"}
              </Button>
              {mode === "edit" && (
                <Button
                  onClick={handleDelete}
                  variant="contained"
                  color="inherit"
                >
                  delete
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MyCard;
