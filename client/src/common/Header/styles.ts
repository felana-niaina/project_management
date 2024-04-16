import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
  },
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    marginTop: "0.5rem",
    marginBottom: "0.5rem",
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
}));

export default useStyles;
