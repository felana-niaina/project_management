import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    boxShadow: ""
  },
  
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
  home: {
    marginRight: "30px",
  },
  notifContent:{
    padding:"1.5rem"
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#30499C", // Couleur de la bordure
    },
    "& .MuiInputLabel-root": {
      color: "#000000", // Couleur du label
      fontSize: "0.75rem",
    },
    "& .MuiOutlinedInput-input": {
      color: "#000000", // Couleur du texte saisi
    },
  },
  google_translate_element: {},
}));

export default useStyles;
