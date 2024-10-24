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
  Popper,
  Grid,
  LinearProgress,
  ListItemIcon,
  ListItem,
  ListItemText,
  Popover,
  DialogActions,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import { Autocomplete } from "@mui/material";
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
import SendIcon from "@mui/icons-material/Send";
import { TUser } from "../../../../types/User";
import { TFormulaire } from "../../../../types/Formulaire";
import { getAllUser } from "../../../../api/user-api";

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
const CustomPopper = (props: any) => {
  return <Popper {...props} placement="bottom-start" />;
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
  const [showChecklistInput, setShowChecklistInput] = useState(false);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);
  const [checklistInput, setChecklistInput] = useState("");
  const [textAssign, setTextAssign] = useState("");
  const [showUserList, setShowUserList] = useState(false);
  const [selectedUserMentionne, setSelectedUserMentionne] =
    useState<TUser | null>(null);
  // const [listUser, setListUser]  = useState<TFormulaire[] | []>([]);

  /* Mentionner par @ */
  const { listUser, setListUser } = UserStore((state) => ({
    listUser: state.listUser,
    setListUser: state.setListUser,
  }));
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [openPopper, setOpenPopper] = useState(false);

  const userStore = UserStore();

  // Fonction pour gérer la soumission de la réponse

  const readonlyConfig = {
    readonly: false,
    height: 300,
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
    console.log("carte details :::", newCard)
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

    // const projectId = localStorage.getItem("Project_id");
    const projectId = userStore.user.idProject;

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

  const handleChecklistClick = () => {
    setShowChecklistInput(true);
  };

  const handleChecklistInputChange = (e: any) => {
    setChecklistInput(e.target.value);
  };

  const handleChecklistAdd = () => {
    if (checklistInput.trim() !== "") {
      setChecklistItems([...checklistItems, checklistInput.trim()]);
      setChecklistInput("");
    }
  };

  /* Mentionner fnction */
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewCard({ ...newCard, [name]: value });
    // const value = event.target.value;
    setInputValue(value);

    if (typeof value === "string" && value.includes("@")) {
      const query: any = value.split("@").pop()?.toLowerCase();
      const filteredSuggestions: any = listUser.filter((user) =>
        user.email.toLowerCase().includes(query)
      );
      setSuggestions(filteredSuggestions);
      setOpenPopper(true);
    } else {
      setOpenPopper(false);
    }
  };

  const handleOptionSelect = (event: any, newValue: any) => {
    if (newValue) {
      const email = newValue.email;
      const newInputValue = inputValue.replace(/@\w*$/, `@${email}`);
      setInputValue(newInputValue);
      setNewCard({ ...newCard, assignee: email });
      console.log("user assigné:::", newCard.assignee);

      setOpenPopper(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUser(); // Assurez-vous que cette fonction existe
      if (result && result.result) {
        setListUser(result.result);
      }
    };

    fetchUsers();
  }, [setListUser]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"lg"}
      style={{ maxHeight: "100vh", height: "100%" }}
    >
      {/* <DialogTitle>{title}</DialogTitle> */}
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={2}
            style={{ marginBottom: "2rem", marginTop: "2rem" }}
          >
            <Grid xs={10} style={{ margin: "auto" }}>
              <Grid
                item
                xs={12}
                style={{
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  gap:"60px"
                }}
              >
                <TextField
                  label="Titre"
                  required
                  value={newCard.title}
                  onChange={handleFormChange}
                  name="title"
                  fullWidth
                />
                <Autocomplete
                  open={openPopper}
                  onClose={() => setOpenPopper(false)}
                  onInputChange={handleInputChange}
                  onChange={handleOptionSelect}
                  options={suggestions}
                  style={{ width: "100%", marginRight: "10px" }}
                  getOptionLabel={(option: any) => option.email}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assigné à"
                      required
                      value={newCard.assignee ? newCard.assignee.email:""}
                      name="assignee"
                      onChange={handleInputChange}
                      fullWidth
                    />
                  )}
                  PopperComponent={CustomPopper}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {option.email}
                    </li>
                  )}
                />
              </Grid>

              <Grid item xs={12} style={{ display: "flex", marginTop: "20px",justifyContent: "space-between",gap:"60px",marginBottom:"20px" }}>
                <TextField
                  label="Date de début"
                  type="date"
                  required
                  onChange={handleFormChange}
                  value={newCard.startDate}
                  name="startDate"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  
                />
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
                {/* <TextField
                  label="Joindre fichier"
                  type="file"
                  onChange={handleFormChange}
                  value={newCard.attachment}
                  name="lastname"
                  fullWidth
                /> */}
                <TextField
                  label="% de l'avancement du tâche"
                  required
                  onChange={handleFormChange}
                  value={newCard.progress}
                  name="progress"
                  fullWidth
                  
                />
              </Grid>

              
              <Grid>
                {showChecklistInput && (
                  <Grid
                    container
                    spacing={2}
                    xs={12}
                    style={{ display: "flex" }}
                  >
                    <Grid item xs={8}>
                      <TextField
                        label="Nouvel élément de checklist"
                        value={checklistInput}
                        onChange={handleChecklistInputChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <IconButton onClick={handleChecklistAdd} color="primary">
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  {checklistItems.map((item, index) => (
                    <Grid container key={index} spacing={1} alignItems="center">
                      <Grid item>
                        <Checkbox />
                      </Grid>
                      <Grid item>
                        <ListItemText primary={item} />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
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
