import { makeStyles } from "@material-ui/core/styles";
import qqq from "../../assets/qqq.jpg";
import background from "../../assets/aaa.jpg";
// import background from "../../assets/background.jpg";
const useStyles = makeStyles({
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
      color: "#002f5d",
      fontSize: "0.75rem",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: "#002f5d", // couleur de la ligne avant le focus
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#002f5d", // couleur de la ligne après le focus
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#002f5d", // couleur du label après le focus
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#002f5d",
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
});

export default useStyles;
