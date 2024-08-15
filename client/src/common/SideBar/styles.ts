import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0.75rem",
    fontFamily: "Roboto-Regular, Arial, sans-serif",
    height: "100%",
    color: "#030D06",
    // background: "#080912",
    // background: "#FCF3D9",
    background: "#1e0059",
    // border: "2px solid #DEE3E0",
    [theme.breakpoints.down("sm")]: {
      height: "auto",
    },
  },
  logoAccueil: {
    marginTop: "15px", 
    display: "block",      
  },
  logoMobile:{
    [theme.breakpoints.down("sm")]: {
      width: "100px",
    },
    [theme.breakpoints.up("xs")]: {
      width: "100px",// Adjust padding on medium and larger screens
    },
  },
  containerMobile: {
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    [theme.breakpoints.up("md")]: {
      display: "none", // Adjust padding on medium and larger screens
    },
  },
  containerWeb: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("md")]: {
      display: "block", // Adjust padding on medium and larger screens
    },
  },
  icon: {
    color: "#455459",
  },
  myProjectOnclick: {
    paddingLeft: "1rem",
  },
}));

export default useStyles;
