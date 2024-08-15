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
    // backgroundColor: "#06080E",
    
    // background: "linear-gradient(to right,#384CA2,#85B7BE)",
    // overflowX: "scroll",
    // "& .ScrollbarsCustom-TrackX": {
    //   display: "none !important", // Hide the vertical scrollbar track
    // },
    display: "flex",
    whiteSpace: "nowrap", // Empêche les colonnes de passer à la ligne
    paddingTop: "1rem",
    fontFamily: "Arial",
    // marginTop: "4rem",
    height: "45rem",
  },

  columnContainer: {
    display: "flex",
    whiteSpace: "nowrap",
    paddingLeft: "1rem",
    height: "100%",
  },

  column: {
    width: "20rem",
    // height: "10rem",
    paddingBottom: "1rem",
    marginRight: "2rem",
    // overflowY: "scroll",
    "& .ScrollbarsCustom-TrackY": {
      display: "none !important", // Hide the vertical scrollbar track
    },
    // borderBottomLeftRadius:"10px",
    // borderBottomRightRadius:"10px",
    // paddingTop: "0.5rem",
    // background: "linear-gradient(to right, #F8F8FF, #F5F5DC)",
    
    marginBottom: "1rem",
    // border: "2px solid #F9EDCD",
    // boxShadow:"rgba(0,0,0,0.5) 0px 0px 1px 0px, rgba(0,0,0,0.2) 0px 1px 3px 0px !important",
    color: "#FFFFFF",
  },
  plus: {
    position:"relative",
    display:'flex',
    backgroundColor: "#195B8A",
    width:'20px !important',
    height:"20px !important",
    borderRadius:"100%",
    alignItems: "center",
    justifyContent:"center",
    color: "#DDEDF9",

    
  },

  valueCard: {
    fontSize:"15px",
    display : "flex",
    flexDirection:"column",
    flexWrap:"wrap"
  },
  valueProgress:{
    color: "#506268",
    fontSize:"20px",
    // '& .MuiLinearProgress-barColorPrimary': {
    //   backgroundColor: 'rgb(214, 224, 223) !important',
    // },
   
  },
  cardModif :{
    // boxShadow:"rgba(0,0,0,0.5) 0px 0px 1px 0px, rgba(0,0,0,0.2) 0px 1px 3px 0px !important",
  },
  valueCardContent:{
    fontSize:"15px",
    display : "flex",
    flexDirection:"column",
    flexWrap:"wrap"
  },
  backlog:{
    margin: "1rem",
    display:"flex",
    backgroundColor: "#F6F8FE",
    color: "#506268",
    fontFamily: 'Roboto-Regular, Arial, sans-serif',
  },
  carte: {
    margin: "1rem",
    display:"flex",
    backgroundColor: "#F6F8FE",
    // borderRadius: "10px",
    color: "#506268",
    // border: "1px solid #F8DF9B",
    // boxShadow:"rgba(0,0,0,0.5) 0px 0px 1px 0px, rgba(0,0,0,0.2) 0px 1px 3px 0px !important",
    fontFamily: 'Roboto-Regular, Arial, sans-serif',
    // marginBottom: "1rem",
  },
  colName: {
    padding: "1rem",
    color:"#1e0059"
    // background: "linear-gradient(to right, #F8F8FF, #F5F5DC)",
    // // width: "23rem",
    // // borderRadius: "5px",
  },
  aFaire: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#1e0059 !important",
      
    },
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#1e0059",
    },
  },
  enCours: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#1e0059 !important",
    },
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#1e0059",
    },
  },
  codeRevue: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#1e0059 !important",
    },
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#1e0059",
    },
  },
  termine: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#1e0059 !important",
    },
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#1e0059",
    },
  },
  
  stepIcon: {
    "& .Mui-active": {
      color: "green !important", // Couleur pour l'icône active
    },
    "& .Mui-completed": {
      color: "#2f9432 !important", // Couleur pour l'icône complétée
    },
    "& .Mui-disabled": {
      color: "#ddd !important", // Couleur pour l'icône non active
    },
  },
 

});

export default useStyles;
