import { TextField, Button, Grid } from "@material-ui/core";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import configUrl from "../../utils";
import useStyles from "./styles";
import { useState } from "react";
import { loginAuth } from "../../api/auth-api";
import InputAdornment from "@mui/material/InputAdornment";
import EmailIcon from "@mui/icons-material/Email";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { useTranslation } from 'react-i18next';
import loginPicture from "../../assets/loginPicture.png"
import loginProfile from "../../assets/loginProfile.png";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from 'react-toastify';

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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };
  const login = async (e: any) => {
    e.preventDefault();
    try {
      const logged = await loginAuth(data);
      console.log("logged response:", logged);
      if (logged && logged.redirectPath) {
        history(logged.redirectPath);
      } else {
        console.error("Redirect path not found in response!");
        toast.error("Erreur lors de la connexion. Veuillez vérifier vos informations.");
        
        // Optionally, show an error message to the user
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Une erreur est survenue, veuillez réessayer.");
      // Optionally, show an error message to the user
    }
  };
  const toSignUp = () => {
    history("/createUsers");
  };

  return (
    <div className="container mx-auto  gap-36 flex justify-center items-center min-h-screen">
      <div className={classes.photoPC}><img src={loginPicture} alt="loginPicture" className="w-80"/></div>
      <div className="flex gap-8 flex-col">
        <div className="flex justify-center items-center"><img src={loginProfile} alt="loginProfile" className="w-20"/></div>
        <div className="flex justify-center flex-col items-center">
          <h1>{t('welcomeLogin')} !</h1>
          <p>{t('welcomeLoginDescritption')}</p>
        </div>
        <div>
          <form onSubmit={login} className="flex justify-center flex-col">
            {/* <h3 className={classes.userLogin} color="primary">
              USER LOGIN
            </h3> */}
            <TextField
              label={t('eMail')}
              required
              className={classes.textField}
              onChange={handleChange}
              value={data.mail}
              name="mail"
              style={{ paddingBottom: "1rem"}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EmailIcon style={{ color: "#f50057" }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label={t('password')}
              type={showPassword ? "text" : "password"}
              required
              className={classes.textField}
              onChange={handleChange}
              value={data.password}
              name="password"
              style={{ paddingBottom: "1rem" }}
              
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <span onClick={togglePasswordVisibility} style={{ cursor: "pointer"}}>
                        {showPassword ? <VisibilityOff style={{ color: "#f50057" }} /> : <Visibility style={{ color: "#f50057" }} />}
                    </span>
                  </InputAdornment>
                ),
                
              }}
              
            />
            {/* <div
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
            </div> */}
            {/* <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Se connecter
            </Button> */}
            <div className="flex justify-center items-center mt-3">
              <Button
                type="submit"
                variant="contained"
                style={{
                  height: "40px",
                  width: "30%",
                  backgroundColor: "#f50057",
                  color: "#fff",
                  borderRadius: 0,
                }}
              >
                {t('login')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default Authentification;
