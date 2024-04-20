import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#06080E",
    overflowX: "scroll",
    minHeight: "100vh",
  },
  gif: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    width: "100% !important",
  },

  bienvenu: {
    fontSize: "1rem",
    margin: "auto",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    width: "80%",
  },
  typographySalutation: {
    textAlign: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "2rem !important",
  },
  typographyInvitation: {
    fontSize: "1.5rem !important",
    color: "#979BAA",
  },
  doughnut: {
    width: "300px",
    color: "white",
  },
  pie: {
    width: "300px",
    color: "white",
  },

  nombresProjetsEquipes: {
    display: "flex",
    justifyContent: "center",
  },
  nombresProjets: {
    background: "linear-gradient(#874CCC,#C65BCF)",
    width: "500px",
    padding: "20px",
    borderRadius: "20px",
    margin: "30px",
    textAlign: "center",
    marginRight: "40px",
  },
  nombresEquipes: {
    background: "linear-gradient(#1679AB,#5DEBD7)",
    width: "500px",
    padding: "20px",
    borderRadius: "20px",
    margin: "30px",
    textAlign: "center",
    marginLeft: "40px",
  },
});

export default useStyles;
