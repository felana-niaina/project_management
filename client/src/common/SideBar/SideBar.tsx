import { Link, useNavigate } from "react-router-dom";
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

const SideBar = () => {
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
    setListVisible(!isListVisible);
  };

  const idProjectUser = userStore.user.idProject[0];
  const projectColumn = async (id: any, name: any) => {
    await localStorage.setItem("Project_name", name);
    await localStorage.setItem("Project_id", id);
    await getSelectedProject();
    await lengthNotification(idProjectUser);
    history("/accueil");
  };

  const logOut = async () => {
    await loggOut();
    history("/");
  };
  const handleUsers = () => {
    history("/teams");
  };
  const handleBacklogs = (projectId: any) => {
    history(`/backlog/${projectId}`);
  };
  const SprintPlanning = (projectId: any) => {
    history(`/sprintPlanning/${projectId}`);
  };
  const dashboardScrum = (projectId: any) => {
    history(`/dashboardScrum/${projectId}`);
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
          <Link to="/accueil">
            <img
              src={myLogo}
              alt="Mon Logo"
              className={classes.logoMobile}
            />
          </Link>
          <span onClick={toggleDrawer(true)}>
            <ListItemIcon>
              <MenuIcon style={{ fontSize: 40 }} />
            </ListItemIcon>
          </span>
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
            <Link to="/accueil">
              <img
                src={myLogo}
                alt="Mon Logo"
                style={{ width: "125px", marginRight: "7rem" }}
              />
            </Link>
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
              onClick={() => dashboardScrum(userStore.user.idProject[0])}
            >
              <ListItemIcon style={{ color: "white" }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Dashboard</ListItemText>
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
                  Project List
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
                <ListItemText style={{ color: "white" }}>Teams</ListItemText>
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
                onClick={() => SprintPlanning(userStore.user.idProject[0])}
              >
                <ListItemIcon style={{ color: "white" }}>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText style={{ color: "white" }}>
                  Sprint planning
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
                  Task follow up
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
              onClick={logOut}
            >
              <ListItemIcon style={{ color: "white" }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>Sign Out</ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </div>
      <div className={classes.containerWeb}>
        <Link to="/accueil">
          <img
            src={myLogo}
            alt="Mon Logo"
            style={{ width: "125px", marginRight: "7rem" }}
          />
        </Link>

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
            onClick={() => dashboardScrum(userStore.user.idProject[0])}
          >
            <ListItemIcon style={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }}>Dashboard</ListItemText>
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
                Project List
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
              <ListItemText style={{ color: "white" }}>Teams</ListItemText>
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
              onClick={() => SprintPlanning(userStore.user.idProject[0])}
            >
              <ListItemIcon style={{ color: "white" }}>
                <EventIcon />
              </ListItemIcon>
              <ListItemText style={{ color: "white" }}>
                Sprint planning
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
                Task follow up
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
            onClick={logOut}
          >
            <ListItemIcon style={{ color: "white" }}>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText style={{ color: "white" }}>Sign Out</ListItemText>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default SideBar;
