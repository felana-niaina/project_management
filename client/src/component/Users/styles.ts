import { makeStyles } from "@material-ui/core/styles";
import fonds from "../../assets/rm380-01.jpg";
import fondsContainer from "../../assets/aaa.jpg";
const useStyles = makeStyles({
  container: {
    backgroundImage: `url(${fonds})`,
    paddingTop: "5rem",
    paddingBottom: "5rem",
  },
  contentContainer: {
    margin: "auto",
    width: "35%",
    backgroundImage: `url(${fondsContainer})`,
    // background: "white",
    color: "#4682B4",
    boxShadow: "0px 5px 8px black",
    borderRadius: "5px",
  },

  uploadButton: {
    position: "relative",
    bottom: 0,
    right: 0,
    backgroundColor: "#3498db",
    padding: "8px",
    borderRadius: "50%",
    transition: "background-color 0.3s",
    width: "40px", // Ajoutez une largeur fixe pour le conteneur
    height: "40px", // Ajoutez une hauteur fixe pour le conteneur
    marginTop: "-40px",
    marginLeft: "6rem",
    "&:hover": {
      backgroundColor: "#2980b9",
    },
    "& input[type=file]": {
      fontSize: "30px",
      left: 0,
      top: 0,
      opacity: 0,
      width: "100%",
      height: "100%",
    },
    "&:after": {
      content: '"+"',
      color: "white",
      fontSize: "26px",
      position: "absolute", // Utilisez une position absolue
      top: "50%", // Placez le texte au milieu verticalement
      left: "50%", // Placez le texte au milieu horizontalement
      transform: "translate(-50%, -50%)",
    },
  },
});

export default useStyles;
