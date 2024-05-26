import { TextField, Button, Grid } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import configUrl from "../../utils";
import useStyles from "./styles";
import { useState } from "react";
import { loginAuth } from "../../api/auth-api";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useTranslation } from 'react-i18next';
type TData = {
  mail: string;
  password: string;
};

const defaultData: TData = {
  mail: "",
  password: "",
};

const Authentification = () => {
  const [data, setData] = useState(defaultData);
  const { t } = useTranslation();
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
  const toSignUp = () => {
    history("/createUsers");
  };

  return (
    <div className={classes.container}>
      <div className={classes.containerContent}>
        <Grid className={classes.titre}>
          <h1>{t('welcomeLogin')} !</h1>
          <p>{t('welcomeLoginDescritption')}</p>
        </Grid>
        <Grid
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={classes.authentification}
        >
          <form onSubmit={login} className={classes.form}>
            {/* <h3 className={classes.userLogin} color="primary">
              USER LOGIN
            </h3> */}
            <TextField
              label={t('eMail')}
              required
              fullWidth
              className={classes.textField}
              onChange={handleChange}
              value={data.mail}
              name="mail"
              style={{ paddingBottom: "1rem" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon style={{ color: "#002f5d" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={t('password')}
              type="password"
              required
              className={classes.textField}
              onChange={handleChange}
              fullWidth
              value={data.password}
              name="password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VpnKeyIcon style={{ color: "#002f5d" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Grid
              item
              xs={12}
              style={{
                textAlign: "right",
                marginTop: "1rem",
                marginRight: "2rem",
              }}
            >
              <a onClick={toSignUp}>
              {t('createCompte')}?
              </a>
            </Grid>
            {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Se connecter
            </Button> */}
            <Grid
              item
              xs={12}
              style={{
                textAlign: "center",
                paddingTop: "2rem",
                paddingBottom: "1.5rem",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                style={{
                  height: "50px",
                  width: "50%",
                  backgroundColor: "#002f5d",
                  color: "#fff",
                  borderRadius: 0,
                }}
              >
                {t('login')}
              </Button>
            </Grid>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default Authentification;
