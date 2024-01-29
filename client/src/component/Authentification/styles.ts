import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    background: "linear-gradient(to right, #7ddaf8, #F5F5DC, #7ddaf8)",
    paddingTop: "5rem",
    paddingBottom: "11rem",
  },
  containerContent: {
    paddingTop: "3rem",
    width: "30%",
    background: "linear-gradient(to right, #6394cf, #6aaaf2)",
    margin: "auto",
    marginTop: "3rem",
  },
  authentification: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "3rem",
  },

  button: {
    marginTop: "3rem",
    marginBottom: "2rem",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
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
