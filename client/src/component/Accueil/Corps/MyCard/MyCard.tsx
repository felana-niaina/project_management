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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import UserStore from "../../../../store/UserStore";

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
  onSubmitComment: any;
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
  onSubmitComment,
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
  const [comment, setComment] = useState(""); //à supprimer
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  /* mentionner  */
  const [textAssign, setTextAssign] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUserMentionne, setSelectedUserMentionne] = useState(null);
  const { listUser, setListUser } = UserStore();

  // à supprimer
  const handleChangeComment = (e: any) => {
    setComment(e.target.value);
  };

  // Fonction pour gérer le clic sur le bouton Reply
  const handleReplyClick = () => {
    setReplying(true);
  };

  // Fonction pour gérer la soumission de la réponse
  const handleSubmitReply = () => {
    // Logique de soumission de la réponse
    onSubmitComment(replyContent); // Soumission du commentaire
    setReplyContent(""); // Réinitialisation du contenu de la réponse
    setReplying(false); // Fermeture du champ de réponse
  };

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

  //à effacer
  const handleChangeMentionne = (e: any) => {
    const newText = e.target.value;
    setTextAssign(newText);
    if (newText.endsWith("@")) {
      setShowUserList(true);
    } else {
      setShowUserList(false);
    }
  };
  //à effacer
  const handleUserSelection = (user: any) => {
    setSelectedUserMentionne(user);
    setShowUserList(false);
    setTextAssign(textAssign.replace(/@$/, `@${user.username} `));
  };

  useEffect(() => {
    setNewCard({ ...data });
  }, [data]);

  const handleFormChange = (e: any) => {
    console.log(e.target);
    const { name, value } = e.target;
    if (name === "assignee") {
      const newText = e.target.value;
      setTextAssign(newText);
      if (newText.endsWith("@")) {
        setShowUserList(true);
      } else {
        setShowUserList(false);
      }
    }
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
        message: "une carte a été ajouté par l'admin",
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
                {showUserList && (
                  <ul>
                    {listUser.map((user) => (
                      <li
                        key={user.id}
                        onClick={() => handleUserSelection(user)}
                      >
                        {user.username}
                      </li>
                    ))}
                  </ul>
                )}
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
              <Grid>
                <textarea
                  value={comment}
                  onChange={handleChangeComment}
                  placeholder="Write your comment here..."
                  style={{ width: "100%" }}
                />
                <button onClick={handleReplyClick}>
                  <FontAwesomeIcon icon={faReply} /> Reply
                </button>

                {replying && (
                  <Grid item xs={12}>
                    <TextareaAutosize
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your reply here..."
                      style={{ width: "100%" }}
                    />
                  </Grid>
                )}
                {/* Bouton de soumission de la réponse */}
                {replying && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitReply}
                    >
                      Submit Reply
                    </Button>
                  </Grid>
                )}
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
