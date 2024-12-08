import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Assignment from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import TaskIcon from "@mui/icons-material/Task";
import EventIcon from "@mui/icons-material/Event";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import ListAltOutlined from "@mui/icons-material/ListAltOutlined";
import SendIcon from "@mui/icons-material/Send";
import ProjectStore from "../../store/StoreProject";
import { useEffect, useState } from "react";
import { TProject } from "../../types/Project";
import { useTranslation } from "react-i18next";
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
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import projectPlanner from "../../assets/myLogoPlanifieo.png";
import myLogo from "../../assets/mylogoP.png";
import SprintPlanning from "../../component/SprintPlanning";
import DashboardScrum from "../../component/DashboardScrum";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getAllSprint } from "../../api/sprint-api";
import { TSprint } from "../../types/Sprint";

const SideBar = () => {
  const navigate = useNavigate();
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
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [openModal, setOpenModal] = useState(false); // État pour le modal

  const handleDashboardClick = () => {
    setShowDashboard(true);
  };

  const [openMenu, setOpenMenu] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenMenu(newOpen);
  };
  let dashboardContent;
  if (showDashboard) {
    if (userStore.user.role === "SCRUM MANAGER") {
      dashboardContent = <DashboardScrum />;
    } else if (userStore.user.role === "DEVELLOPER") {
    } else {
    }
  }

  const handleNewProjectClick = () => {
    setShowInput(true);
  };
  const { t } = useTranslation();
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
    // await createProject(name);
    await getListProject();
    setShowInput(false);
  };

  const projectList = () => {
    history(`/projectList`);
    // setListVisible(!isListVisible);
  };

  const idProjectUser = userStore.user.idProject[0];
  const projectColumn = async (id: any, name: any) => {
    await localStorage.setItem("Project_name", name);
    await localStorage.setItem("Project_id", id);
    await getSelectedProject();
    await lengthNotification(idProjectUser);
    setOpenMenu(false);
    try{
      const sprintData = await getAllSprint(idProjectUser);
      const inProgressSprint = sprintData.result.find(
        (sprint: TSprint | any) => sprint.status === "in-progress"
      );
      if (inProgressSprint) {
        // Si un sprint "in-progress" est trouvé, on le sélectionne
        setSelectedSprintId(inProgressSprint._id);
        setActiveStep(sprintData.result.findIndex((sprint: TSprint | any) => sprint._id === inProgressSprint._id));
        navigate(`/accueil/${inProgressSprint._id}`);
      } else if (sprintData.result.length > 0) {
        // Sinon, on sélectionne le premier sprint par défaut
        setSelectedSprintId(sprintData.result[0]._id);
        navigate(`/accueil/${sprintData.result[0]._id}`);
      }
      // history("/accueil/669bb17b3e773e841c453d81");
    }catch{

    }

  };

  const logOut = async () => {
    await loggOut();
    setOpenModal(false);
    setOpenMenu(false);
    history("/");
  };
   // Fonction pour ouvrir le modal
   const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUsers = () => {
    history("/teams");
    setOpenMenu(false);
  };
  const handleBacklogs = (projectId: any) => {
    history(`/backlog/${projectId}`);
    setOpenMenu(false);
  };
  const SprintPlanning = () => {
    history(`/sprintPlanning`);
    setOpenMenu(false);
  };
  // const dashboardScrum = (projectId: any) => {
  //   history(`/dashboardScrum/${projectId}`);
  //   setOpenMenu(false);
  // };
  const handleDashboardNavigation  = (user:any) => {
    const projectId = user.idProject[0]; // Suppose qu'il y a un seul projet
    const role = user.role.name; // Récupère le rôle de l'utilisateur connecté
    console.log("role manager",role)
    if (role === "SCRUM MANAGER") {
      history(`/dashboardScrum/${projectId}`);
    } else if (role === "PRODUCT OWNER") {
      history(`/dashboardProductOwner`);
    } else {
      console.warn("Rôle utilisateur non reconnu ou accès interdit.");
    }
    setOpenMenu(false);
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
    <div className={classes.container}>
      <div className={classes.containerMobile}>
        <div className={classes.logoAccueil}>
          <div style={{ display: "flex" }}>
            <div onClick={() => handleDashboardNavigation(userStore.user)}>
              <img src={myLogo} alt="Mon Logo" className={classes.logoMobile} />
            </div>
            <span onClick={toggleDrawer(true)}>
              <ListItemIcon>
                <MenuIcon style={{ fontSize: 40 }} />
              </ListItemIcon>
            </span>
          </div>
        </div>
        <Drawer
          open={openMenu}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#1e0059",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
            <div onClick={() => handleDashboardNavigation(userStore.user)}>
              <img
                src={myLogo}
                alt="Mon Logo"
                style={{ width: "125px", marginRight: "7rem" }}
              />
            </div>
            <Button onClick={toggleDrawer(false)}>
              <ListItemIcon style={{ color: "#fffff" }}>
                <CloseIcon style={{ fontSize: 25 }} />
              </ListItemIcon>
            </Button>
          </div>

          <List className="space-y-2">
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#764ce8",
                },
              }}
              onClick={() => handleDashboardNavigation(userStore.user)}
            >
              <ListItemIcon style={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Tableau de bord</ListItemText>
            </ListItem>
            {userStore.user.role?.name == "PRODUCT OWNER" && (
              <ListItem
                button
                sx={{
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#764ce8",
                    color: "#192652",
                  },
                }}
                onClick={projectList}
              >
                <ListItemIcon style={{ color: "white" }}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>
                  Liste des projets
                </ListItemText>
              </ListItem>
            )}
            {isListVisible && (
              <div className={classes.myProjectOnclick}>
                <List component="nav" aria-label="main mailbox folders">
                  {listProject?.map((project: TProject | any) => (
                    <ListItem
                      button
                      sx={{
                        "&:hover": {
                          backgroundColor: "#764ce8",
                          color: "#192652",
                          margin: "0 !important",
                        },
                      }}
                      onClick={() => projectColumn(project?._id, project.name)}
                    >
                      <ListItemIcon style={{ color: "#030D06" }}>
                        <Assignment />
                      </ListItemIcon>
                      <ListItemText
                        primary={project.name}
                        sx={{ margin: "0 !important", padding: "0" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
            {userStore.user.role?.name == "SCRUM MANAGER" && (
              <ListItem
                button
                sx={{
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#764ce8",
                    color: "#192652",
                  },
                }}
                onClick={handleUsers}
              >
                <ListItemIcon style={{ color: "white" }}>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>Equipes</ListItemText>
              </ListItem>
            )}
            {userStore.user.role?.name == "PRODUCT OWNER" && (
              <ListItem
                button
                sx={{
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#764ce8",
                    color: "#192652",
                  },
                }}
                onClick={() =>
                  handleBacklogs(localStorage.getItem("Project_id"))
                }
              >
                <ListItemIcon style={{ color: "white" }}>
                  <TaskIcon />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>Backlogs</ListItemText>
              </ListItem>
            )}
            {(userStore.user.role?.name == "PRODUCT OWNER" ||
              userStore.user.role?.name == "SCRUM MANAGER") && (
              <ListItem
                button
                sx={{
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#764ce8",
                    color: "#192652",
                  },
                }}
                onClick={() => SprintPlanning()}
              >
                <ListItemIcon style={{ color: "white" }}>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>
                  Plannification de sprint
                </ListItemText>
              </ListItem>
            )}
            {!(userStore.user.role?.name == "PRODUCT OWNER") && (
              <ListItem
                button
                sx={{
                  width: "100%",
                  "&:hover": {
                    backgroundColor: "#764ce8",
                    color: "#192652",
                  },
                }}
                onClick={() =>
                  projectColumn(
                    localStorage.getItem("Project_id"),
                    localStorage.getItem("Project_name")
                  )
                }
              >
                <ListItemIcon style={{ color: "white" }}>
                  <Assignment />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>
                  Suivi des taches
                </ListItemText>
              </ListItem>
            )}
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={handleOpenModal} // Ouvre le modal au clic
            >
              <ListItemIcon style={{ color: "white" }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Déconnexion</ListItemText>
            </ListItem>
          </List>
        </Drawer>
        
      </div>
      <div className={classes.containerWeb}>
        <div style={{ display: "flex" }}>
          <div>
            <div onClick={() => handleDashboardNavigation(userStore.user)}>
              <img
                src={myLogo}
                alt="Mon Logo"
                style={{ width: "125px", marginRight: "7rem" }}
              />
            </div>
          </div>

          {/* <div id="google_translate_element"></div> */}
        </div>

        <List className="space-y-2">
          <ListItem
            button
            sx={{
              width: "100%",
              "&:hover": {
                backgroundColor: "#764ce8",
                color: "#764ce8",
              },
            }}
            onClick={() => handleDashboardNavigation(userStore.user)}
          >
            <ListItemIcon style={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }}>Tableau de bord</ListItemText>
          </ListItem>
          {userStore.user.role?.name == "PRODUCT OWNER" && (
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={projectList}
            >
              <ListItemIcon style={{ color: "white" }}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>
                Liste des projets
              </ListItemText>
            </ListItem>
          )}
          {isListVisible && (
            <div className={classes.myProjectOnclick}>
              <List component="nav" aria-label="main mailbox folders">
                {listProject?.map((project: TProject | any) => (
                  <ListItem
                    button
                    sx={{
                      "&:hover": {
                        backgroundColor: "#764ce8",
                        color: "#192652",
                        margin: "0 !important",
                      },
                    }}
                    onClick={() => projectColumn(project?._id, project.name)}
                  >
                    <ListItemIcon style={{ color: "#030D06" }}>
                      <Assignment />
                    </ListItemIcon>
                    <ListItemText
                      primary={project.name}
                      sx={{ margin: "0 !important", padding: "0" }}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {userStore.user.role?.name == "SCRUM MANAGER" && (
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={handleUsers}
            >
              <ListItemIcon style={{ color: "white" }}>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Equipes</ListItemText>
            </ListItem>
          )}
          {userStore.user.role?.name == "PRODUCT OWNER" && (
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={() => handleBacklogs(localStorage.getItem("Project_id"))}
            >
              <ListItemIcon style={{ color: "white" }}>
                <TaskIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Backlogs</ListItemText>
            </ListItem>
          )}
          {(userStore.user.role?.name == "PRODUCT OWNER" ||
            userStore.user.role?.name == "SCRUM MANAGER") && (
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={() => SprintPlanning()}
            >
              <ListItemIcon style={{ color: "white" }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>
                Plannification de sprint
              </ListItemText>
            </ListItem>
          )}
          {!(userStore.user.role?.name == "PRODUCT OWNER") && (
            <ListItem
              button
              sx={{
                width: "100%",
                "&:hover": {
                  backgroundColor: "#764ce8",
                  color: "#192652",
                },
              }}
              onClick={() =>
                projectColumn(
                  localStorage.getItem("Project_id"),
                  localStorage.getItem("Project_name")
                )
              }
            >
              <ListItemIcon style={{ color: "white" }}>
                <Assignment />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>
                Suivi des taches
              </ListItemText>
            </ListItem>
          )}
          <ListItem
            button
            sx={{
              width: "100%",
              "&:hover": {
                backgroundColor: "#764ce8",
                color: "#192652",
              },
            }}
            onClick={handleOpenModal}
          >
            <ListItemIcon style={{ color: "white" }}>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }}>Déconnexion</ListItemText>
          </ListItem>
        </List>
      </div>
      {/* Modal de confirmation */}
      <Dialog
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Déconnexion"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Voulez-vous vraiment vous déconnecter ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Annuler
            </Button>
            <Button onClick={logOut} color="secondary" autoFocus>
              Se déconnecter
            </Button>
          </DialogActions>
        </Dialog>
    </div>
  );
};

export default SideBar;
