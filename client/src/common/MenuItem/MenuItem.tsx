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
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

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
        {/* <ListItem
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
        </ListItem> */}
        <ListItem>
          <FormGroup>
            <FormControlLabel
              control={<MaterialUISwitch sx={{ m: 1 }} defaultChecked />}
              label="Mode Sombre"
            />
          </FormGroup>
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
          <ListItemText primary="Log out" onClick={logOut} />
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
