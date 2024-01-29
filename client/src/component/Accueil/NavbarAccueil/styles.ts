import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  appBar: {
    // background: "linear-gradient(to right, #77b5fe, #d7e6ff, #95b7e8)",
    background: "linear-gradient(to right, #8098D9, #99ACE1)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "0.5rem 1rem",
  },
  projectName: {
    marginRight: "10rem",
    fontFamily: "Georgia",
  },
  search: {
    width: "300px",
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
