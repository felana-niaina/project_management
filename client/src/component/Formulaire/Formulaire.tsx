import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import { TFormulaire } from "../../types/Formulaire";
import Loader from "../../common/Loader";
import { getAllUser } from "../../api/user-api";
import { useState, useEffect } from "react";
import defaultImage from "../../assets/profil.png";
import useStyles from "./styles";
import DialogFormulaire from "./dialogueFormulaire/DialogFormulaire";
import configUrl from "../../utils";

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

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("");
  const [data, setData] = useState(defaultFormulaire);

  const getUser = async () => {
    setIsLoading(true);
    const result = await getAllUser();
    setUser(result);
    if (result) {
      setUser(result.result);
    }
    setIsLoading(false);
  };
  console.log(user);
  useEffect(() => {
    getUser();
  }, []);

  const handleRowClick = (user: TFormulaire) => {
    setData(user);
    setTitle("Détails de l'utilisateur");
    setMode("edit");
    setOpen(!open);
  };

  const addUser = () => {
    setTitle("Créer un nouvel utilisateur");
    setMode("create");
    setData(defaultFormulaire);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Loader isLoading={isLoading} />
      <Button
        variant="contained"
        color="primary"
        onClick={addUser}
        className={classes.create}
      >
        Create User +
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Profile</TableCell>
              <TableCell>Nom d'utilisateur</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Email</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogFormulaire
        open={open}
        handleClose={handleClose}
        title={title}
        mode={mode}
        data={data}
        trigger={getUser}
      />
    </div>
  );
};

export default Formulaire;
