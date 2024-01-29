import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#8098D9",
    overflowX: "scroll",
  },

  bienvenu: {
    float: "right",
    width: "30%",
    margin: "auto",
    border: "dashed 5px grey",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "8rem",
    marginBottom: "8rem",
    padding: "10rem",
  },
  typography: {
    textAlign: "center",
    justifyContent: "center",
    color: "white",
  },
});

export default useStyles;
