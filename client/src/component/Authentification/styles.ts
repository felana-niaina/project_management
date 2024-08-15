import { makeStyles } from "@material-ui/core/styles";
import qqq from "../../assets/qqq.jpg";
import background from "../../assets/aaa.jpg";
// import background from "../../assets/background.jpg";
const useStyles = makeStyles((theme) => ({
  container: {
    backgroundImage: `url(${qqq})`,
    minHeight: "100vh",
    overflowY: "hidden",
  },
  pc: {
    float: "left",
  },
  containerContent: {
    paddingTop: "2rem",
    width: "30%",
    backgroundImage: `url(${background})`,
    margin: "auto",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",

    // borderRadius: "30px",
  },
  textField: {
    "& label": {
      color: "#3f3d56",
      fontSize: "0.75rem",
    },
    
    "& .MuiInput-underline:before": {
      borderBottomColor: "#f50057", // couleur de la ligne avant le focus
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#f50057", // couleur de la ligne après le focus
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#f50057", // couleur du label après le focus
      
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#f50057",
    },
    // Styles pour enlever le contour autour du champ de saisie
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none !important', // Supprime la bordure autour du champ de saisie
        outline : "none !important"
      },
      '&.Mui-focused fieldset': {
        border: 'none !important', // Supprime la bordure en focus
        outline:"none !important"
      },
    },
    '& .MuiInputBase-input': {
      outline: 'none', // Supprime l'outline du champ de saisie
      border: 'none', // Assurez-vous que la bordure est également supprimée
    },
    
  },
  authentification: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // paddingTop: "2rem",
  },

  button: {
    marginTop: "3rem",
  },
  form: {
    // backgroundColor: "white",
    padding: "2rem",

    // borderRadius: "30px",
    // height: "22rem",
  },
  titre: {
    textAlign: "center",
    color: "#002f5d",
    fontFamily: "Georgia",
  },
  userLogin: {
    textAlign: "center",
    color: "rgb(39,48,146)",
  },
  photoPC :{
    [theme.breakpoints.down('sm')]: {
      display: "none",
    },
    [theme.breakpoints.up('md')]: {
      display: "block", // Adjust padding on medium and larger screens
    },
  },
}));

export default useStyles;
