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
import Assignment from "@mui/icons-material/Assignment";
import FolderIcon from "@mui/icons-material/Folder";
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
import SprintPlanning from "../../component/SprintPlanning";
import DashboardScrum from "../../component/DashboardScrum";

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
  const [showDashboard, setShowDashboard] = useState(false);
  const handleDashboardClick = () => {
    setShowDashboard(true);
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
    <div className=" mx-auto fixed" style={{ width: "16.5%" }}>
      <aside aria-label="Sidebar">
        <div
          className="overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 min-h-100 min-h-screen"
          style={{ width: "100%" }}
        >
          <Link to="/accueil">
            <img
              src={projectPlanner}
              alt="Mon Logo"
              style={{ width: "100px", marginRight: "7rem" }}
            />
          </Link>
          <ul className="space-y-2">
            <li>
              <a
                onClick={() =>
                  dashboardScrum(userStore.user.idProject[0])
                }
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            {userStore.user.role?.name == "PRODUCT OWNER" && (
              <li>
                <a
                  onClick={projectList}
                  target="_blank"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Project List
                  </span>
                </a>
              </li>
            )}
            {isListVisible && (
              <div className={classes.myProjectOnclick}>
                <List component="nav" aria-label="main mailbox folders">
                  {listProject?.map((project: TProject | any) => (
                    <ListItem
                      button
                      sx={{
                        "&:hover": {
                          backgroundColor: "#E2E8FC",
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
              <li>
                <a
                  onClick={handleUsers}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">Teams</span>
                </a>
              </li>
            )}
            {userStore.user.role?.name == "PRODUCT OWNER" && (
              <li>
                <a
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() =>
                    handleBacklogs(localStorage.getItem("Project_id"))
                  }
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Backlogs
                  </span>
                </a>
              </li>
            )}
            {(userStore.user.role?.name == "PRODUCT OWNER" ||
              userStore.user.role?.name == "SCRUM MANAGER") && (
              <li>
                <a
                  onClick={() =>
                    SprintPlanning(userStore.user.idProject[0])
                  }
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Sprint planning
                  </span>
                </a>
              </li>
            )}
            {!(userStore.user.role?.name == "PRODUCT OWNER") && (
              <li>
                <a
                  onClick={() =>
                    projectColumn(
                      localStorage.getItem("Project_id"),
                      localStorage.getItem("Project_name")
                    )
                  }
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg
                    className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Task follow up
                  </span>
                </a>
              </li>
            )}
            <li>
              <a
                onClick={logOut}
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default MenuItem;
