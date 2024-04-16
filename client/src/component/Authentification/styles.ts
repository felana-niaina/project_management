import { makeStyles } from "@material-ui/core/styles";
import qqq from "../../assets/qqq.jpg";
import background from "../../assets/background.jpg";
const useStyles = makeStyles({
  container: {
    backgroundImage: `url(${background})`,
    paddingTop: "5rem",
    paddingBottom: "11rem",
  },
  pc: {
    float: "left",
  },
  containerContent: {
    paddingTop: "2rem",
    width: "30%",
    backgroundImage: `url(${qqq})`,
    margin: "auto",
    marginTop: "0.5rem",
    borderRadius: "30px",
  },
  authentification: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "2rem",
  },

  button: {
    marginTop: "3rem",
    marginBottom: "2rem",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "30px",
    height: "27rem",
  },
  titre: {
    textAlign: "center",
    color: "white",
    fontFamily: "Georgia",
  },
  userLogin: {
    textAlign: "center",
    color: "rgb(39,48,146)",
  },
});

export default useStyles;
