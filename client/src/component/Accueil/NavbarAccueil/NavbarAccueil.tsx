import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import myLogo from "../../../assets/mylogoP.png";
import Avatar from "@mui/material/Avatar";
import profil from "../../../assets/profil.png";
import fille from "../../../assets/fille.png";
import useStyles from "./styles";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import ProjectStore from "../../../store/StoreProject";
import DialogColumn from "../Corps/DialogColumn";
import { TColumn } from "../../../types/Column";
import { sendInvitation } from "../../../api/mailInvitation-api";
import UserStore from "../../../store/UserStore";
import { TUser } from "../../../types/User";
import { TInvitation } from "../../../types/MailInvitation";
import { getRoles, getUsersByProjectId } from "../../../api/user-api";
import configUrl from "../../../utils";
import defaultImage from "../../../assets/profil.png";
import { useTranslation } from "react-i18next";
import { TRole } from "../../../types/Role";
import { getProjectName } from "../../../api/project-api";

const defaultColumn: TColumn = {
  name: "",
  card: [],
};

const NavbarAccueil = () => {
  const projectStore = ProjectStore();
  const classes = useStyles();
  const [column, setColumn] = useState<TColumn[] | []>(
    projectStore.project.column
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [openColumnDialog, setOpenColumnDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [mail, setMail] = useState("");
  const [dataColumn, setDataColumn] = useState(defaultColumn);
  const [listUser, setListUser] = useState<TUser[] | []>([]);
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState<TRole[] | any[]>([]);
  const [nameProject, setnameProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  // const [profile,setProfile]=useState<TUser[] | []>
  const userStore = UserStore();

  // const currentProject = localStorage.getItem("Project_id");
  const currentProject = userStore.user.idProject[0];

  const fetchRoles = async () => {
    const result = await getRoles();
    setRoles(result);
    console.log("ROles::::", result);
    console.log("ROles apres fetch::::", roles);
  };
  const getNameProject = async()=>{
    const result = await getProjectName(currentProject);
    setnameProject(result.name)
    setEndDateProject(result.endDate)
     console.log("nameProject by id",result )
   }
  // const getCollaborateur = async () => {
  //   const result: any = await getUsersByProjectId(currentProject);
  //   // setListUser(result.result);

  //   if (result) {
  //     setListUser(result.data.result);
  //     console.log("listUser :::", listUser);
  //   }
  // };
  const getCollaborateur = async () => {
    if (currentProject) {
      const result = await getUsersByProjectId(currentProject);
      console.log("result list user::::", result);
      if (result && result.data && result.data.result) {
        setListUser(result.data.result);
      }
    }
  };

  const handleClose: any = () => {
    setOpen(!open);
    if (open) {
      setMail("");
    }
  };
  const handleChangeRole = (e: any) => {
    setSelectedRole(e.target.value); // Mettre à jour la valeur du rôle à chaque changement
  };
  const handleChange = (e: any) => {
    setMail(e.target.value);
  };
  const id_project = userStore.user.idProject[0];
  const name_project = localStorage.getItem("Project_name");

  const data: TInvitation = {
    idProject: id_project,
    nameProject: name_project,
    role: selectedRole,
    mail: mail,
  };
  const handleValidate = async () => {
    data.role = selectedRole;
    await sendInvitation(data);
    handleClose();
  };

  const handleSearch = () => {
    // Ajoutez ici la logique de recherche en fonction de la valeur de `searchQuery`
    console.log("Recherche:", searchQuery);
  };
  const handleCloseDialog = () => {
    setOpenColumnDialog(!openColumnDialog);
  };

  const addColumn = () => {
    setTitle("Ajouter une nouvelle colonne");
    setDataColumn(defaultColumn);
    setOpenColumnDialog(!openColumnDialog);
  };

  // useEffect(() => {
  //   getCollaborateur();
  // }, []);
  useEffect(() => {
    fetchRoles();
    getNameProject();
  }, []);

  useEffect(() => {
    getCollaborateur();
  }, [currentProject]);
  return (
    <div>
      <div
        className={classes.appBar}
        style={{ position: "fixed", width: "100%", marginTop: "0 !important" }}
      >
        <Typography className={classes.projectName}>
          {nameProject}
        </Typography>

        <div className={classes.avatarContainer}>
          <div>
            <span>Membres :</span>
          </div>
          {listUser &&
            listUser.map((listUser: TUser | any) => (
              <Avatar
                alt="profil"
                src={
                  listUser.image
                    ? `${configUrl.base_uri}/file/${listUser.image}`
                    : defaultImage
                }
                className={classes.avatar}
                style={{ cursor: "pointer" }}
                title={listUser.lastname}
              />
            ))}
          {userStore.user.role?.name == "SCRUM MANAGER" && (
            <IconButton
              color="inherit"
              style={{
                fontWeight: "bold",
                display: "flex",
                borderRadius: "50px",
                border: "1px solid #1e0059",
                width: "30px",
                height: "30px",
                color: "#1e0059",
              }}
              onClick={handleClose}
              title="Ajouter membre"
            >
              +
            </IconButton>
          )}
        </div>
        <div className={classes.addColumn}>
          <Button
            style={{ background: "#f50057", color: "#fff" }}
            variant="contained"
            onClick={addColumn}
          >
            Colonne +
          </Button>
        </div>
      </div>
      <DialogColumn
        column={column}
        open={openColumnDialog}
        handleClose={handleCloseDialog}
        data={dataColumn}
        projectName={projectStore.project.name}
      />
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Grid style={{marginBottom:"20px"}}>
            <span>Invitation adressé à :</span>
            <TextField
              className={classes.textField}
              name="mail"
              onChange={handleChange}
              value={mail}
              label="Entrer l'email "
              fullWidth
              style={{border:"1px solid #1e0059"}}
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
            style={{width:"100%",border:"1px solid #1e0059", height:"60px"}}
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
            style={{
              background: "#fff",
              color: "#1e0059",
              border: "1px solid #1e0059",
            }}
            onClick={handleClose}
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
    </div>
  );
};

export default NavbarAccueil;
