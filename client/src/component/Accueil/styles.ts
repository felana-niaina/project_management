import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  carouselContainer :{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "spaceBetween"
  },
  carouselItem :{
    width: "48%",
    marginBottom: "10px"
  },
  root: {
    // backgroundColor: "#06080E",
    // backgroundColor: "#FDF6E2",
    backgroundColor: "#F6F8FE",
    overflowX: "scroll",
    overflow: "hidden",
    minHeight: "100vh",
    
    
  },
  gif: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
    width: "100% !important",
  },

  bienvenu: {
    fontSize: "1rem",
    margin: "auto",
    // textAlign: "center",
    // justifyContent: "center",
    // alignItems: "center",
    padding: "2rem",
    // width: "80%",
  },
  typographySalutation: {
    textAlign: "center",
    justifyContent: "center",
    color:"#050810",
    fontSize: "1.5rem !important",
    // fontSize: "1rem !important",
  },
  typographyInvitation: {
    fontSize: "1rem !important",
    textAlign: "center",
    justifyContent: "center",
    // fontSize: "0.75rem !important",
    color:"#050810"
  },
  doughnut: {
    width: "200px",
    color: "white",
  },
  pie: {
    width: "200px",
    color: "white",
  },

  nombresProjetsEquipes: {
    display: "flex",
    justifyContent: "center",
  },
  nombresProjets: {
    background: "linear-gradient(#874CCC,#C65BCF)",
    width: "450px",
    padding: "20px",
    borderRadius: "20px",
    margin: "20px",
    textAlign: "center",
    marginRight: "5px",
    height: "200px",
  },
  
  nombresEquipes: {
    background: "linear-gradient(#1679AB,#5DEBD7)",
    width: "450px",
    padding: "20px",
    borderRadius: "20px",
    margin: "20px",
    textAlign: "center",
    height: "200px",
  },
  add:{
    border:"dashed 2px rgba(0,0,0,0.5)",
    margin:"35px",
    padding:"20px",
    paddingLeft:"70px",
    paddingRight:"70px",
    display:'flex',
    flexDirection:"column",
    color:"#000000 !important",
    backgroundColor:"#fff",
    
  },
  addSpan:{
    fontSize:"1.5rem",
    textAlign:"center"
  },
  addSpanPlus:{
    fontSize:"4rem",
    textAlign:"center"
  },

  cardContent: {
    // backgroundColor: "#FCF3D9",
    backgroundColor: "#F6F8FE",
    margin:"35px",
    padding:"20px",
    // border: "2px solid #BDC8EB ",
    boxShadow:"rgba(0,0,0,0.5) 0px 0px 1px 0px, rgba(0,0,0,0.2) 0px 1px 3px 0px !important",
    
  },
  
  tasksName: {
    color: "#050810",
    display: "flex",
    justifyContent:"space-between",
    width:"190px !important"
  },
  card: {
    display: "flex",
    marginLeft:"30px"
  },
  iconeAssignment:{
    background: "none"
  }
});

export default useStyles;
