import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  appBar: {
    background: "#F6FDF9",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    color: "#1B2832",
    // opacity: 0.9,
    border: "2px solid #DEE3E0",
    zIndex:100
  },
  projectName: {
    marginRight: "10rem",
    marginLeft: "2rem",
    fontFamily: "Georgia",
    fontSize: "1.5em",
    textTransform: "uppercase",
  },
  textField: {
    "& .MuiInput-underline:after": {
      borderBottomColor: "#f50057", // couleur de la ligne après le focus
    },
    "& .MuiInputLabel-root.Mui-focused": {
      display: "none", // couleur du label après le focus
      
    },
   
    // Styles pour enlever le contour autour du champ de saisie
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: 'none !important', // Supprime la bordure autour du champ de saisie
        outline : "none !important"
      },
      '&.Mui-focused fieldset': {
        border: 'none !important', // Supprime la bordure en focus
        outline:"none !important"
      },
    },
    '& .MuiInputBase-input': {
      outline: 'none', // Supprime l'outline du champ de saisie
      border: 'none', // Assurez-vous que la bordure est également supprimée
    },
    
  },
  avatarContainer: {
    display: "flex",
    alignItems: "center",
    marginLeft: "20rem",
  },

  avatar: {
    width: 32,
    height: 32,
    marginRight: 1,
    border: "2px solid #fff",
  },
  addColumn: {
    margin: "auto",
  },
});

export default useStyles;
