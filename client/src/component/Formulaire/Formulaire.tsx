import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Snackbar,
} from "@material-ui/core";
import { LinearProgress, Box, Typography } from "@mui/material";
import { TFormulaire } from "../../types/Formulaire";
import myLogo from "../../assets/mylogoP.png";
import Loader from "../../common/Loader";
import { getAllUser, getRoles, getUserTaskCount } from "../../api/user-api";
import { useState, useEffect } from "react";
import defaultImage from "../../assets/profil.png";
import useStyles from "./styles";
import DialogFormulaire from "./dialogueFormulaire/DialogFormulaire";
import configUrl from "../../utils";
import { TInvitation } from "../../types/MailInvitation";
import { sendInvitation } from "../../api/mailInvitation-api";
import { Grid } from "@mui/material";
import { getUsersByRole } from "../../api/user-api";
import { TRole } from "../../types/Role";
import { count } from "console";
import ProjectStore from "../../store/StoreProject";
import { TProject } from "../../types/Project";
import { getListProject, getSelectedProject } from "../../api/project-api";

const defaultFormulaire: TFormulaire = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  idProject: "",
};

const Formulaire = () => {
  const classes = useStyles();
  const projectStore: any = ProjectStore();
  const [listProject, setListProject] = useState<TProject[] | []>([]);
  const [taskCounts, setTaskCounts] = useState<{ [key: string]: number }>({});
  const [userTasks, setUserTasks] = useState<{ [key: string]: any[] }>({});
  const [user, setUser] = useState<TFormulaire[] | []>([]);
  const [userDev, setUserDev] = useState<TFormulaire[]>([]);
  const [userTester, setUserTester] = useState<TFormulaire[] | []>([]);
  let totalDevelopers = 0;
  let totalTesters = 0;
  let totalMembers = 0;
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [dataUser, setDataUser] = useState(defaultFormulaire);
  const [mail, setMail] = useState("");
  const [roles, setRoles] = useState<TRole[] | any[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [invitationSent, setInvitationSent] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectStore.listProject.length > 0 ? projectStore.listProject[0]._id : ""
  );
  const id_project = localStorage.getItem("Project_id");
  const name_project = localStorage.getItem("Project_name");
  let roleUser = "";
  const data: TInvitation = {
    idProject: selectedProject,
    nameProject: name_project,
    role: selectedRole,
    mail: mail,
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = event.target.value;
    setSelectedProject(selectedProjectId);
    console.log("Projet sélectionné:", selectedProjectId);
    // Vous pouvez gérer l'action ici.
  };

  useEffect(() => {
    const getList = async () => {
      await getListProject();
      await getSelectedProject();
    };
    getList();
  }, []);

  useEffect(() => {
    // Met à jour la liste locale des projets
    setListProject(projectStore.listProject);

    // Préselectionne le premier projet si la liste n'est pas vide
    if (projectStore.listProject.length > 0) {
      const firstProjectId = projectStore.listProject[0]._id;
      setSelectedProject(firstProjectId);
    }
  }, [projectStore.listProject]);
  
  const fetchRoles = async () => {
    const result = await getRoles();
    setRoles(result);
    console.log("ROles::::", result);
    console.log("ROles apres fetch::::", roles);
  };

  const handleChangeRole = (e: any) => {
    setSelectedRole(e.target.value); // Mettre à jour la valeur du rôle à chaque changement
  };
  const handleChange = (e: any) => {
    setMail(e.target.value);
  };
  const getUser = async () => {
    setIsLoading(true);
    const result = await getAllUser();
    setUser(result);
    if (result) {
      setUser(result.result);
    }
    setIsLoading(false);
  };

  const getUsersByRoleDevelopper = async (roles: any[]) => {
    const role = roles.find((role: any) => role.name === "DEVELOPPEUR")?._id;
    console.log("id dev::", role);
    const result: any = await getUsersByRole(role);
    console.log("user Developper :::", result);
    setUserDev(result || []);
  };
  const getUsersByRoleTester = async (roles: any[]) => {
    const role = roles.find((role: any) => role.name === "TESTEUR")?._id;
    console.log("id testeur::", role);
    const result: any = await getUsersByRole(role);
    console.log("user testeur :::", result);
    setUserTester(result || []);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    getUser();
    if (roles.length > 0) {
      getUsersByRoleDevelopper(roles);
      getUsersByRoleTester(roles);
    }
  }, [roles]);

  useEffect(() => {
    totalDevelopers = userDev.length; // Calcul du nombre total de développeurs
    totalTesters = userTester.length; // Calcul du nombre total de testeurs
    totalMembers = totalDevelopers + totalTesters;
    console.log(totalMembers);
  }, [userDev, userTester]);

  useEffect(() => {
    const fetchTaskCounts = async () => {
      const userIDs = [...userDev, ...userTester].map((user: any) => user._id);
      try {
        const counts = await Promise.all(
          userIDs.map(async (userID) => {
            const response = await getUserTaskCount(userID);
            console.log("response ::::", response);
            return { userID, count: response.taskCount, tasks: response.tasks };
          })
        );
        const taskCountMap = counts.reduce((acc, { userID, count }) => {
          acc[userID] = count;
          return acc;
        }, {} as { [key: string]: number });
        setTaskCounts(taskCountMap);
        // Construire une carte des tâches associées pour chaque utilisateur
        const taskMap = counts.reduce((acc, { userID, tasks }) => {
          acc[userID] = tasks;
          return acc;
        }, {} as { [key: string]: any[] }); // Le tableau de tâches pour chaque utilisateur
        setUserTasks(taskMap);
        console.log("taskCountMap::::", taskCountMap);
        console.log("taskMap::::", taskMap);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des comptes de tâches par utilisateur : ",
          error
        );
      }
    };

    fetchTaskCounts();
  }, [userDev, userTester]);

  const handleRowClick = (user: TFormulaire) => {
    setDataUser(user);
    setTitle("Détails de l'utilisateur");
    setMode("edit");
    setOpen(!open);
  };
  const handleCloseInvitation = () => {
    setOpenInvitation(!openInvitation);
    if (openInvitation) {
      setMail("");
    }
  };
  const addUser = () => {
    setTitle("Créer un nouvel utilisateur");
    setMode("create");
    setDataUser(defaultFormulaire);
    setOpen(!open);
  };
  const handleValidate = async () => {
    data.role = selectedRole;

    await sendInvitation(data);
    handleCloseInvitation();
    setInvitationSent(true);
  };

  const handleClose = () => {
    setOpen(!open);
  };
  const handleSnackbarClose = () => {
    setInvitationSent(false); // Réinitialiser l'état lorsque le Snackbar est fermé
  };
  return (
    <div style={{ backgroundColor: "#f6fdf9", paddingTop: "20px" }}>
      <Loader isLoading={isLoading} />
      <Snackbar
        open={invitationSent} // Afficher le Snackbar lorsque l'invitation est envoyée
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Invitation envoyée"
      />

      <div>
        <Grid>
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              borderRadius: "5px",
              background: "#fff",
              paddingBottom: "10px",
              paddingTop: "20px",
              paddingRight: "30px",
              paddingLeft: "30px",
              display: "flex",
              flexDirection: "row",
              width: "97%",
              justifyContent: "space-between",
              marginLeft: "20px",
            }}
          >
            <div className="p-3">
              <select
                value={selectedProject}
                onChange={handleSelectChange}
                style={{
                  padding: "32px",
                  backgroundColor: "#E2E8FC",
                  color: "#192652",
                }}
              >
                {projectStore.listProject.map((project: TProject | any) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div
              style={{
                display: "flex",
                padding: "5px",
                flexDirection: "column",
                marginLeft: "10px",
                borderRadius: "5px",
                justifyContent: "center",
                alignItems: "center",
                color: "#000",
              }}
            >
              <span
                style={{
                  display: "flex",
                  textAlign: "center",
                  fontSize: "2rem",
                  fontWeight:"bold",
                  opacity:"0.8"
                }}
              >
                {userDev.length + userTester.length}
              </span>
              <span
                style={{
                  display: "flex",
                  textAlign: "center",
                  fontSize: "1rem",
                  opacity:"0.5"
                }}
              >
                Collaborateurs
              </span>
            </div>

            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseInvitation}
                className={classes.create}
                style={{ margin: "30px", background: "#f50057", color: "#fff" }}
              >
                Nouveau membre +
              </Button>
            </div>
          </div>
        </Grid>
        <Grid
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "20px",
          }}
        >
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              borderRadius: "5px",
              background: "#fff",
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingRight: "30px",
              paddingLeft: "30px",
              display: "flex",
              flexDirection: "column",
              width: "50%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
            >
              <h1 style={{ fontSize: "0.75rem" }}>Equipes de Développement</h1>
            </div>
            <div>
              {Array.isArray(userDev) &&
                userDev.map((userDev: any) => (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "7px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: 90,
                          height: 90,
                          overflow: "hidden",
                          borderRadius: "100%",
                          backgroundColor: "",
                        }}
                      >
                        <img
                          src={
                            userDev.image
                              ? `${configUrl.base_uri}/file/${userDev.image}`
                              : defaultImage
                          }
                          alt="profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "end",
                          paddingLeft: "10px",
                          color: "#000",
                          textAlign: "end",
                        }}
                      >
                        <span style={{ opacity: "0.5" }}>
                          {userDev.firstname} {userDev.lastname}
                        </span>
                        <span style={{ fontWeight: "bold", opacity: "0.8" }}>
                          {userDev.email}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: "5px 20px",
                        flexDirection: "row",
                        borderRadius: "5px",
                        justifyContent: "space-between",
                        background: "#ee780d",
                        alignItems: "center",
                        color: "#fff",
                        marginBottom: "30px",
                      }}
                    >
                      <span style={{ display: "flex", textAlign: "center" }}>
                        Nombre de tâches assignées
                      </span>
                      <span style={{ fontSize: "2rem" }}>
                        {taskCounts[userDev._id] || 0}
                      </span>
                    </div>
                    <div className="mt-3">
                      {/* Afficher la liste des tâches pour cet utilisateur */}
                      <ul
                        className="gap-3"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {userTasks[userDev._id]?.map((task) => (
                          <li key={task.id} className="mb-3">
                            <div style={{display:"flex", justifyContent:"space-between",borderBottom:"2px solid #f5f5f5", marginBottom:"8px"}}>
                              <span style={{ opacity: "0.7" }}>Titre : </span>
                              <span style={{ opacity: "0.8" , fontWeight:"bold"}}>{task.title}</span>
                            </div>
                            <div style={{display:"flex", justifyContent:"space-between",marginBottom:"8px"}}>
                              <span style={{ opacity: "0.7" }}>Date limite: </span>
                              <span style={{ opacity: "0.8" , fontWeight:"bold"}}>{task.dueDate}</span>
                            </div>
                            {/* <p>Progress: {task.progress}</p> */}
                            {/* Afficher la progression sous forme de barre de progression */}
                            <Box display="flex" alignItems="center">
                              <Box width="100%" mr={1}>
                                <LinearProgress
                                  variant="determinate"
                                  value={task.progress}
                                  style={{ height: "20px" }}
                                />
                              </Box>
                              <Box minWidth={35}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  style={{opacity:"1", fontWeight:"bold"}}
                                >
                                  {`${Math.round(task.progress)}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div
            style={{
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              borderRadius: "5px",
              background: "#fff",
              paddingTop: "10px",
              paddingBottom: "10px",
              paddingRight: "30px",
              paddingLeft: "30px",
              display: "flex",
              flexDirection: "column",
              width: "50%",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "10px",
              }}
            >
              <h1 style={{ fontSize: "0.75rem" }}>Les membres de Testeur</h1>
            </div>
            <div>
              {Array.isArray(userTester) &&
                userTester.map((userTester: any) => (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "7px",
                        marginBottom: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: 90,
                          height: 90,
                          overflow: "hidden",
                          borderRadius: "100%",
                        }}
                      >
                        <img
                          src={
                            userTester.image
                              ? `${configUrl.base_uri}/file/${userTester.image}`
                              : defaultImage
                          }
                          alt="profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "end",
                          paddingLeft: "10px",
                          color: "#000",
                        }}
                      >
                        <span style={{ opacity: "0.5" }}>
                          {userTester.firstname} {userTester.lastname}
                        </span>
                        <span style={{ opacity: "0.8", fontWeight: "bold" }}>
                          {userTester.email}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        padding: "5px 20px",
                        flexDirection: "row",
                        marginLeft: "10px",
                        borderRadius: "5px",
                        justifyContent: "space-between",
                        background: "#ee780d",
                        alignItems: "center",
                        color: "#fff",
                        marginBottom: "30px",
                      }}
                    >
                      <span>Nombre de tâches assignées</span>
                      <span style={{ fontSize: "2rem" }}>
                        {taskCounts[userTester._id] || 0}
                      </span>
                    </div>
                    <div className="mt-3">
                      {/* Afficher la liste des tâches pour cet utilisateur */}
                      <ul
                        className="gap-3"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {userTasks[userTester._id]?.map((task) => (
                          <li key={task.id} className="mb-3">
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                borderBottom: "2px solid #f5f5f5",
                                marginBottom:"10px"
                              }}
                            >
                              <span style={{opacity:"0.7"}}>Titre : </span>
                              <span style={{opacity:"0.8", fontWeight:"bold"}}>{task.title}</span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom:"10px"
                              }}
                            >
                              <span style={{opacity:"0.7"}}>Date limite: </span>
                              <span style={{opacity:"0.8", fontWeight:"bold"}}>{task.dueDate}</span>
                            </div>

                            {/* <p>Progress: {task.progress}</p> */}
                            {/* Afficher la progression sous forme de barre de progression */}
                            <Box display="flex" alignItems="center">
                              <Box width="100%" mr={1}>
                                <LinearProgress
                                  variant="determinate"
                                  value={task.progress}
                                  style={{ height: "20px" }}
                                />
                              </Box>
                              <Box minWidth={35}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  style={{fontWeight:"bold",opacity:"1"}}
                                >
                                  {`${Math.round(task.progress)}%`}
                                </Typography>
                              </Box>
                            </Box>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* <TableContainer component={Paper} style={{ margin: "30px" }}>
          <h5>DEVELOPPEUR</h5>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userDev) &&
              userDev.map((userDev: any) => (
                <TableRow
                  key={userDev._id}
                  onClick={() => handleRowClick(userDev)}
                >
                  <TableCell>
                    {" "}
                    <img
                      src={
                        userDev.image
                          ? `${configUrl.base_uri}/file/${userDev.image}`
                          : defaultImage
                      }
                      alt="profile"
                      width={30}
                      height={30}
                    />
                  </TableCell>
                  <TableCell>{userDev.username}</TableCell>
                  <TableCell>{userDev.firstname}</TableCell>
                  <TableCell>{userDev.lastname}</TableCell>
                  <TableCell>{userDev.email}</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer> */}
          {/* <TableContainer component={Paper} style={{ margin: "30px" }}>
          <h5>TESTEUR</h5>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(userTester) &&
              userTester.map((userTester: any) => (
                <TableRow
                  key={userTester._id}
                  onClick={() => handleRowClick(userTester)}
                >
                  <TableCell>
                    {" "}
                    <img
                      src={
                        userTester.image
                          ? `${configUrl.base_uri}/file/${userTester.image}`
                          : defaultImage
                      }
                      alt="profile"
                      width={30}
                      height={30}
                    />
                  </TableCell>
                  <TableCell>{userTester.username}</TableCell>
                  <TableCell>{userTester.firstname}</TableCell>
                  <TableCell>{userTester.lastname}</TableCell>
                  <TableCell>{userTester.email}</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </TableContainer> */}
        </Grid>
      </div>

      {/* <TableContainer component={Paper} style={{ margin: "30px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.map((user) => (
              <TableRow onClick={() => handleRowClick(user)}>
                <TableCell>
                  {" "}
                  <img
                    src={
                      user.image
                        ? `${configUrl.base_uri}/file/${user.image}`
                        : defaultImage
                    }
                    alt="profile"
                    width={30}
                    height={30}
                  />
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          variant="contained"
          color="primary"
          onClick={addUser}
          className={classes.create}
        >
          Create User +
        </Button>
      </TableContainer> */}
      <Dialog
        open={openInvitation}
        onClose={handleCloseInvitation}
        PaperProps={{
          style: {
            width: "400px", // Largeur souhaitée
            height: "400px", // Hauteur souhaitée
          },
        }}
      >
        <div style={{ marginTop: "10px" }}>
          <img
            src={myLogo}
            alt="Mon Logo"
            style={{ width: "100px", marginTop: "7px", marginBottom: "7px" }}
          />
        </div>
        <DialogContent>
          <Grid style={{ marginBottom: "20px" }}>
            <span>Invitation adressé à :</span>
            <TextField
              className={classes.textField}
              name="mail"
              onChange={handleChange}
              value={mail}
              label="Entrer l'email "
              fullWidth
              style={{ border: "1px solid #1e0059" }}
            />
          </Grid>
          <Grid>
            <label htmlFor="invitation">En tant que</label>
          </Grid>
          <select
            name="role"
            id="role"
            onChange={handleChangeRole}
            value={selectedRole}
            style={{
              width: "100%",
              border: "1px solid #1e0059",
              height: "60px",
            }}
          >
            {Array.isArray(roles) &&
              roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
          </select>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseInvitation}
            style={{
              background: "#fff",
              color: "#1e0059",
              border: "1px solid #1e0059",
            }}
          >
            Annuler
          </Button>

          <Button
            variant="contained"
            style={{ background: "#1e0059", color: "#fff" }}
            onClick={handleValidate}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
      <DialogFormulaire
        open={open}
        handleClose={handleClose}
        title={title}
        mode={mode}
        data={dataUser}
        trigger={getUser}
      />
    </div>
  );
};

export default Formulaire;
