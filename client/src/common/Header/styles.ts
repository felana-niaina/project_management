import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
  
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
  noRing: {
    "&:focus": {
      outline: "none", // Remove Tailwind focus outline
      boxShadow: "none", // Remove Tailwind box shadow
    },
  },
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    
    '&.Mui-focused': {
      '--tw-ring-shadow': 'none !important', // Override the TailwindCSS ring shadow
      boxShadow: 'none', // Ensure no box shadow
      outline: 'none',   // Remove outline
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff", // Couleur de la bordure
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
