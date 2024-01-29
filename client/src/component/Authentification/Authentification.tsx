import { TextField, Button, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import configUrl from "../../utils";
import useStyles from "./styles";
import { useState } from "react";
import { loginAuth } from "../../api/auth-api";

type TData = {
  username: string;
  password: string;
};

const defaultData: TData = {
  username: "",
  password: "",
};

const Authentification = () => {
  const [data, setData] = useState(defaultData);

  const classes = useStyles();
  const history = useNavigate();

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const login = async (e: any) => {
    e.preventDefault();
    const logged = await loginAuth(data);
    if (logged) {
      history("/accueil");
    }
    return;
  };

  return (
    <div className={classes.container}>
      <div className={classes.containerContent}>
        <Grid className={classes.titre}>
          <h1>Welcome !</h1>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={classes.authentification}
        >
          <form onSubmit={login} className={classes.form}>
            <h3 className={classes.userLogin} color="primary">
              USER LOGIN
            </h3>
            <TextField
              label="Nom d'utilisateur"
              required
              fullWidth
              onChange={handleChange}
              value={data.username}
              name="username"
              style={{ paddingBottom: "1rem" }}
            />
            <TextField
              label="Mots de passe"
              type="password"
              required
              onChange={handleChange}
              fullWidth
              value={data.password}
              name="password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Login
            </Button>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default Authentification;
