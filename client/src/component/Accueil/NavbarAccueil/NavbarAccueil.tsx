import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
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
import { getUsersByProjectId } from "../../../api/user-api";
import configUrl from "../../../utils";
import defaultImage from "../../../assets/profil.png";

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

  // const [profile,setProfile]=useState<TUser[] | []>
  const userStore = UserStore();

  const currentProject = localStorage.getItem("Project_id");

  const getCollaborateur = async () => {
    const result: any = await getUsersByProjectId(currentProject);
    // setListUser(result.result);

    if (result) {
      setListUser(result.data.result);
      console.log("listUser :::", listUser);
    }
  };

  const handleClose = () => {
    setOpen(!open);
    if (open) {
      setMail("");
    }
  };

  const handleChange = (e: any) => {
    setMail(e.target.value);
  };
  const id_project = localStorage.getItem("Project_id");
  const name_project = localStorage.getItem("Project_name");

  const data: TInvitation = {
    idProject: id_project,
    nameProject: name_project,
    mail: mail,
  };
  const handleValidate = async () => {
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

  useEffect(() => {
    getCollaborateur();
  }, []);
  return (
    <div>
      <div
        className={classes.appBar}
        style={{ position: "fixed", width: "100%" }}
      >
        <Typography className={classes.projectName}>
          {projectStore.project.name}
        </Typography>

        <div className={classes.avatarContainer}>
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
              />
            ))}
          <IconButton color="inherit" onClick={handleClose}>
            +
          </IconButton>
        </div>
        <div className={classes.addColumn}>
          <Button color="primary" variant="contained" onClick={addColumn}>
            Column +
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invitation adressé à :</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            name="mail"
            onChange={handleChange}
            value={mail}
            label="Nom du projet"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleValidate}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NavbarAccueil;
