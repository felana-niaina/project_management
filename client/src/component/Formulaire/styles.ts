import { makeStyles } from "@material-ui/core/styles";

const useStyles=makeStyles({
    create:{
        marginTop: "2rem",
        marginBottom:"2rem"
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
})

export default useStyles;