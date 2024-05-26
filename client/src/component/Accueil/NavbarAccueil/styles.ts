import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  appBar: {
    background: "#F6FDF9",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0.5rem 1rem",
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
