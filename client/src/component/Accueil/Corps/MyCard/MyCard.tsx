import { TCard } from "../../../../types/Card";
import { FC, useState, useEffect, useRef, useMemo } from "react";
import { createCard, updateCard, deleteCard } from "../../../../api/card-api";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
  LinearProgress,
  ListItemIcon,
  ListItem,
  ListItemText,
  Popover,
  DialogActions,
} from "@material-ui/core";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DateFnsUtils from "@date-io/date-fns"; // Assurez-vous d'installer date-fns
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { getSelectedProject } from "../../../../api/project-api";
import socket from "../../../../utils/socket";
import JoditEditor from "jodit-react";

type TProps = {
  card: TCard | any;
  open: boolean;
  handleClose: () => void;
  title: string;
  mode: string;
  data: TCard | any;
  trigger: () => void;
  idColumn: string;
  placeholder: string;
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
  placeholder,
}) => {
  const [newCard, setNewCard] = useState(data);
  const [pourcentage, setPourcentage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [ouvert, setOuvert] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | null>(null);
  const editor = useRef(null);
  const [content, setContent] = useState("");
  const readonly = false;
  const placeholders = placeholder || "Start typings...";

  const readonlyConfig = {
    readonly: false,
    placeholder: placeholder || "Start typings...",
  };

  const config = useMemo(() => readonlyConfig, [placeholder]);

  const handleAvancementClick = () => {
    setShowProgress(!showProgress);
  };
  const handleDateClick = () => {
    setOuvert(true);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setCalendarDate(date); // Mettre à jour la date du calendrier
  };

  const handleFermer = () => {
    setOuvert(false);
  };

  const handlePourcentageChange = (event: any) => {
    const value = event.target.value;
    setPourcentage(value);
  };

  useEffect(() => {
    setNewCard({ ...data });
  }, [data]);

  const handleFormChange = (e: any) => {
    console.log(e.target);
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
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"lg"}
      style={{ maxHeight: "100vh", height: "100%" }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            style={{ display: "flex", marginBottom: "2rem", marginTop: "2rem" }}
          >
            <Grid item xs={3}>
              <h5 style={{ marginLeft: "1.7rem" }}>Ajouter à la carte</h5>
              <ListItem button onClick={handleAvancementClick}>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText primary="Avancement" />
              </ListItem>
              {showProgress && (
                <Grid>
                  <TextField
                    label="Entrez le pourcentage"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0, max: 100, step: 1 },
                    }}
                    value={pourcentage}
                    onChange={handlePourcentageChange}
                  />
                  <br />
                  <LinearProgress variant="determinate" value={pourcentage} />
                </Grid>
              )}

              <ListItem button onClick={handleDateClick}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Date" />
              </ListItem>

              <Dialog open={ouvert} onClose={handleFermer}>
                <DialogContent>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      variant="static"
                      open={true}
                      format="MM/dd/yyyy"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                  <TextField
                    label="Date limite"
                    value={
                      calendarDate ? calendarDate.toLocaleDateString() : ""
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                    style={{ marginTop: "8px" }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleFermer} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleFermer} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>

              <ListItem button>
                <ListItemIcon>
                  <ChecklistIcon />
                </ListItemIcon>
                <ListItemText primary="Checklist" />
              </ListItem>

              <ListItem button>
                <ListItemIcon>
                  <AttachmentIcon />
                </ListItemIcon>
                <ListItemText primary="Pièce jointe" />
              </ListItem>
            </Grid>
            <Grid xs={9}>
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
              {/* <Grid item xs={12}>
                <TextareaAutosize
                  minRows={3}
                  placeholder="Description"
                  value={newCard.description}
                  onChange={handleFormChange}
                  name="description"
                />
              </Grid> */}
              <JoditEditor
                ref={editor}
                config={config}
                value={newCard.description}
                onChange={(content: any) => {
                  setContent(content);
                  handleFormChange({
                    target: { name: "description", value: content },
                  }); // Passer un objet simulant un événement
                }}
              />
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
                  label="% de l'évolution du tâche"
                  required
                  onChange={handleFormChange}
                  value={newCard.progress}
                  name="progress"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} style={{ marginTop: "2rem" }}>
                <Button
                  onClick={handleClose}
                  variant="contained"
                  color="secondary"
                  style={{ marginRight: "2rem" }}
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
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MyCard;
