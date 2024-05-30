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
  Snackbar
} from "@material-ui/core";
import { TFormulaire } from "../../types/Formulaire";
import Loader from "../../common/Loader";
import { getAllUser } from "../../api/user-api";
import { useState, useEffect } from "react";
import defaultImage from "../../assets/profil.png";
import useStyles from "./styles";
import DialogFormulaire from "./dialogueFormulaire/DialogFormulaire";
import configUrl from "../../utils";
import { TInvitation } from "../../types/MailInvitation";
import { sendInvitation } from "../../api/mailInvitation-api";
import { Grid } from "@mui/material";
import { getUsersByRole } from "../../api/user-api";

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
  const [user, setUser] = useState<TFormulaire[] | []>([]);
  const [userDev, setUserDev] = useState<TFormulaire[] | []>([]);
  const [userTester, setUserTester] = useState<TFormulaire[] | []>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openInvitation, setOpenInvitation] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [dataUser, setDataUser] = useState(defaultFormulaire);
  const [mail, setMail] = useState("");
  const [role, setRole] = useState("developpeur");
  const [invitationSent, setInvitationSent] = useState(false);
  const id_project = localStorage.getItem("Project_id");
  const name_project = localStorage.getItem("Project_name");
  let roleUser = ""
  const data: TInvitation = {
    idProject: id_project,
    nameProject: name_project,
    role: "",
    mail: mail,
  };

  const handleChangeRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value); // Mettre à jour la valeur du rôle à chaque changement
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
  const getUsersByRoleDevelopper = async () => {
    setIsLoading(true);
    const roleUser = "DEVELOPPEUR";
    const result :any= await getUsersByRole(roleUser);
    setUserDev(result);
    if (result) {
      setUserDev(result.result);
    }
    setIsLoading(false);
  };
  const getUsersByRoleTester = async () => {
    setIsLoading(true);
    roleUser = "TESTEUR";
    const result :any= await getUsersByRole(roleUser);
    setUserTester(result);
    if (result) {
      setUserTester(result.result);
    }
    setIsLoading(false);
  };

  console.log(user);
  useEffect(() => {
    getUser();
    getUsersByRoleDevelopper();
    getUsersByRoleTester();
  }, []);

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
    data.role= role;
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
    <div>
      <Loader isLoading={isLoading} />
      <Snackbar
        open={invitationSent} // Afficher le Snackbar lorsque l'invitation est envoyée
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Invitation envoyée"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCloseInvitation}
        className={classes.create}
        style={{margin:"30px"}}
      >
        New member +
      </Button>
      <Grid style={{ display:"flex" }}>
        <TableContainer component={Paper} style={{margin:"30px"}}>
          <h5>DEVELOPPEUR</h5>
          {userDev?.map((userDev) => (
              <TableRow onClick={() => handleRowClick(userDev)}>
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
        </TableContainer>
        <TableContainer component={Paper} style={{margin:"30px"}}>
          <h5>TESTEUR</h5>
          {userTester?.map((userTester) => (
              <TableRow onClick={() => handleRowClick(userTester)}>
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
        </TableContainer>
      </Grid>
      
      <TableContainer component={Paper} style={{margin:"30px"}}>
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
      </TableContainer>
      <Dialog open={openInvitation} onClose={handleCloseInvitation}>
        <DialogTitle>Invitation adressé à :</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            name="mail"
            onChange={handleChange}
            value={mail}
            label="Adresse Email"
          />
          <Grid>
            <label htmlFor="invitation">En tant que</label>
          </Grid>
          <select name="role" id="role" onChange={handleChangeRole} value={role}>
            <option value="DEVELOPPEUR">Développeur</option>
            <option value="TESTEUR">Testeur</option>
            <option value="USER">Membre</option>
          </select>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleCloseInvitation}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleValidate}>
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
