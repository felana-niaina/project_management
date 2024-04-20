import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
  },
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
  home: {
    marginRight: "30px",
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    marginTop: "1rem",
    marginBottom: "1rem",

    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white", // Couleur de la bordure
    },
    "& .MuiInputLabel-root": {
      color: "white", // Couleur du label
    },
    "& .MuiOutlinedInput-input": {
      color: "white", // Couleur du texte saisi
    },
  },
  google_translate_element: {},
}));

export default useStyles;
