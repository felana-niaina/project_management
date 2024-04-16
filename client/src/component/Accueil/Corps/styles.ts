import { makeStyles } from "@material-ui/core/styles";
import background from "../../../assets/feuille5.jpg";
const useStyles = makeStyles({
  createColumn: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-50px",
    marginRight: "2rem",
  },
  container: {
    // background: "linear-gradient(to right, #7ddaf8, #F5F5DC, #B0C4DE)",
    // background: "linear-gradient(to right,#ADD8E6, #87CEFA, #1E90FF)",
    backgroundImage: `url(${background})`,
    // background: "linear-gradient(to right,#384CA2,#85B7BE)",
    overflowX: "scroll",
    display: "flex",
    whiteSpace: "nowrap", // Empêche les colonnes de passer à la ligne
    paddingTop: "1rem",
    fontFamily: "Arial",
    marginTop: "4rem",
    height: "45rem",
  },

  columnContainer: {
    display: "flex",
    whiteSpace: "nowrap",
    paddingLeft: "1rem",
    height: "100%",
  },

  column: {
    width: "25rem",
    // height: "10rem",
    paddingBottom: "1rem",
    marginRight: "1rem",
    // overflowY: "scroll",
    "& .ScrollbarsCustom-TrackY": {
      display: "none !important", // Hide the vertical scrollbar track
    },
    borderRadius: "10px",
    paddingTop: "0.5rem",
    // background: "linear-gradient(to right, #F8F8FF, #F5F5DC)",
    background: "#DCDCDC",
    marginBottom: "1rem",
  },
  plus: {
    position: "relative",
    // marginBottom: "2rem",
    top: "-6%",
    width: "96%",
    textAlign: "left",
  },
  carte: {
    margin: "1rem",
    backgroundColor: "white",
    borderRadius: "10px",

    // marginBottom: "1rem",
  },
  colName: {
    padding: "1rem",
    // background: "linear-gradient(to right, #F8F8FF, #F5F5DC)",
    // // width: "23rem",
    // // borderRadius: "5px",
  },
});

export default useStyles;
