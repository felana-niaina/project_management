import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#06080E",
    overflowX: "scroll",
    overflow: "hidden",
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
    // textAlign: "center",
    // justifyContent: "center",
    // alignItems: "center",
    padding: "2rem",
    // width: "80%",
  },
  typographySalutation: {
    // textAlign: "center",
    // justifyContent: "center",
    color: "white",
    // fontSize: "2rem !important",
    fontSize: "1rem !important",
  },
  typographyInvitation: {
    // fontSize: "1.5rem !important",
    fontSize: "0.75rem !important",
    color: "#979BAA",
  },
  doughnut: {
    width: "200px",
    color: "white",
  },
  pie: {
    width: "200px",
    color: "white",
  },

  nombresProjetsEquipes: {
    display: "flex",
    justifyContent: "center",
  },
  nombresProjets: {
    background: "linear-gradient(#874CCC,#C65BCF)",
    width: "450px",
    padding: "20px",
    borderRadius: "20px",
    margin: "20px",
    textAlign: "center",
    marginRight: "5px",
    height: "200px",
  },
  nombresEquipes: {
    background: "linear-gradient(#1679AB,#5DEBD7)",
    width: "450px",
    padding: "20px",
    borderRadius: "20px",
    margin: "20px",
    textAlign: "center",
    height: "200px",
  },
  tasks: {
    display: "flex",
    justifyContent: "space-between",
    color: "#fff",
    marginRight: "60px",
    marginLeft: "60px",
  },
  tasksName: {
    marginRight: "10px",
    backgroundColor: "#14B8A6",
    border: "2px solid #1F2937",
    paddingRight: "30px",
    width: "18%",
    paddingLeft: "30px",
    borderRadius: "20px",
  },
});

export default useStyles;
