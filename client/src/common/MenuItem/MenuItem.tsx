import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import Assignment from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import ProjectStore from "../../store/StoreProject";
import { useEffect, useState } from "react";
import { TProject } from "../../types/Project";
import {
  createProject,
  getListProject,
  getSelectedProject,
} from "../../api/project-api";
import useStyles from "./styles";
import { loggOut } from "../../api/auth-api";
import { lengthNotification } from "../../api/notification-api";
import UserStore from "../../store/UserStore";
import NotificationStore from "../../store/NotificationStore";

const MenuItem = () => {
  const projectStore = ProjectStore();
  const notificationStore = NotificationStore();
  const [showInput, setShowInput] = useState(false);
  const userStore = UserStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isListVisible, setListVisible] = useState(false);
  const [listProject, setListProject] = useState<TProject[] | []>([]);
  const history = useNavigate();
  const classes = useStyles();

  const handleNewProjectClick = () => {
    setShowInput(true);
  };

  const handleInputNameChange = (e: any) => {
    setName(e.target.value);
  };

  // const handleClose = () => {
  //   setOpen(!open);
  //   // if (open) {
  //   //   setName("");
  //   // }
  // };

  const handleValidate = async () => {
    await createProject(name);
    await getListProject();
    setShowInput(false);
  };

  const projectList = () => {
    setListVisible(!isListVisible);
  };

  const projectColumn = async (id: string, name: string) => {
    await localStorage.setItem("Project_name", name);
    await localStorage.setItem("Project_id", id);
    await getSelectedProject();
    await lengthNotification();
    history("/accueil");
  };

  const logOut = async () => {
    await loggOut();
    history("/");
  };

  useEffect(() => {
    const getList = async () => {
      await getListProject();
      await getSelectedProject();
    };
    getList();
  }, []);

  useEffect(() => {
    setListProject(projectStore.listProject);
  }, [projectStore.listProject]);

  return (
    <div style={{ position: "fixed" }} className={classes.container}>
      <List>
        <ListItem
          button
          sx={{
            width: "100%",
            "&:hover": {
              backgroundColor: "#1F2128",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon style={{ color: "#ffffff" }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary="My Project" onClick={projectList} />
        </ListItem>

        {isListVisible && (
          <div className={classes.myProjectOnclick}>
            <List component="nav" aria-label="main mailbox folders">
              {listProject?.map((project: TProject | any) => (
                <ListItem
                  button
                  sx={{
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "#1F2128",
                      paddingLeft: "1.5rem",
                      paddingRight: "1.5rem",
                      color: "#FFFFFF",
                    },
                  }}
                  onClick={() => projectColumn(project?._id, project.name)}
                >
                  <ListItemIcon style={{ color: "#ffffff" }}>
                    <Assignment />
                  </ListItemIcon>
                  <ListItemText primary={project.name} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
        {userStore.user.role?.name == "ADMINISTRATEUR" && (
          <ListItem
            button
            sx={{
              width: "100%",
              "&:hover": {
                backgroundColor: "#1F2128",
                paddingLeft: "1.2rem",
                paddingRight: "1.2rem",
                color: "#FFFFFF",
              },
            }}
            // onClick={handleClose}
          >
            <ListItemIcon style={{ color: "#ffffff" }}>
              <AddIcon />
            </ListItemIcon>
            <ListItemText
              primary="New Project"
              onClick={handleNewProjectClick}
            />
          </ListItem>
        )}
        {showInput && (
          <ListItem>
            <TextField
              name="name"
              onChange={handleInputNameChange}
              value={name}
              label="Nom du projet"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleValidate}
            >
              Valider
            </Button>
          </ListItem>
        )}

        <ListItem
          button
          sx={{
            width: "100%",
            "&:hover": {
              backgroundColor: "#1F2128",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              color: "#FFFFFF",
            },
          }}
          onClick={() => history("/users")}
        >
          <ListItemIcon style={{ color: "#ffffff" }}>
            <ListAltOutlined />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          sx={{
            width: "100%",
            "&:hover": {
              backgroundColor: "#1F2128",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon style={{ color: "#ffffff" }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
        <ListItem
          button
          sx={{
            width: "100%",
            "&:hover": {
              backgroundColor: "#1F2128",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              color: "#FFFFFF",
            },
          }}
        >
          <ListItemIcon style={{ color: "#ffffff" }}>
            <LogoutOutlined />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" onClick={logOut} />
        </ListItem>
      </List>

      {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Intitulé du nouveau projet</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            name="name"
            onChange={handleChange}
            value={name}
            label="Nom du projet"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleValidate}>
            Valider
          </Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default MenuItem;
