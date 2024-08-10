import React, { useEffect, useState } from "react";
import NavbarAccueil from "./NavbarAccueil";
import Corps from "./Corps";
import useStyles from "./styles";
// import $ from 'jquery';
// import 'owl.carousel/dist/assets/owl.carousel.css';
// import 'owl.carousel/dist/assets/owl.theme.default.css';
//  import 'owl.carousel/dist/owl.carousel';
import Typography from "@mui/material/Typography";
import ProjectStore from "../../store/StoreProject";
import { getAllColumn } from "../../api/column-api";
import { TProject } from "../../types/Project";
import { TColumn } from "../../types/Column";
import { Grid, IconButton } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import Code from "@mui/icons-material/Code";
import DoneIcon from "@mui/icons-material/Done";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  createProject,
  getListProject,
  getSelectedProject,
} from "../../api/project-api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Accueil = () => {
  const projectStore = ProjectStore();
  const hasProject = projectStore.project.name === "";
  const classes = useStyles();
  const [columns, setColumns] = useState<{ [projectId: string]: TColumn[] }>(
    {}
  );
  const [open, setOpen] = useState(false);
  const [openNewProject, setOpenNewProject] = useState(false);
  const [expanded, setExpanded] = useState<number | false>(false);
  const [name, setName] = useState("");
  const [listProject, setListProject] = useState<TProject[] | []>([]);


  // useEffect(() => {
  //   // Initialiser Owl Carousel après le rendu du composant
  //   console.log('jQuery:', $); // Vérifiez si jQuery est correctement chargé
  //   console.log('Owl Carousel:', $.fn.owlCarousel);
  //   $('.owl-carousel').owlCarousel({
  //     loop: true,
  //     margin: 10,
  //     nav: true,
  //     items: 1, // Affiche un conteneur à la fois
  //   });
  // }, []);
  
  const handleClose = () => {
    setOpen(!open);
    if (open) {
      setName("");
    }
  };
  const handleCloseProject = () => {
    setOpenNewProject(!openNewProject);
    if (openNewProject) {
      setName("");
    }
  };
  const newProject = () => {
    console.log("hello");
    setOpenNewProject(!openNewProject);
  };
  const handleValidate = async () => {
    // await createProject(name);
    await getListProject();
    setOpenNewProject(!openNewProject);
  };

  const handleChange = (e: any) => {
    setName(e.target.value);
  };

  // const showChart = (projectId: string) => {
  //   const chartContainer = document.getElementById(`chart-container-${projectId}`);
  //   if (chartContainer) {
  //     chartContainer.style.display = chartContainer.style.display === 'none' ? 'block' : 'none';
  //   }
  // };
  
  interface ProjectChartProps {
    columns: TColumn[];
  }


  // useEffect(() => {
  //   async function fetchColumns() {
  //     const columnsData: { [projectId: string]: TColumn[] } = {};
  //     for (const project of projectStore.listProject as TProject[] | any) {
  //       try {
  //         const columns = await getAllColumn(project._id);
  //         console.log("columns:::::", columns);

  //         columnsData[project._id] = columns;
  //       } catch (error) {
  //         console.error(
  //           `Error fetching columns for project ${project._id}:`,
  //           error
  //         );
  //       }
  //     }
  //     setColumns(columnsData);
  //     console.log("columnsDAta :::", columnsData);
  //   }

  //   if (projectStore.listProject.length > 0) {
  //     fetchColumns();
  //   }
  // }, [projectStore.listProject]);

  // useEffect(() => {
  //   const getList = async () => {
  //     await getListProject();
  //     await getSelectedProject();
  //   };
  //   getList();
  // }, []);

  // useEffect(() => {
  //   setListProject(projectStore.listProject);
  // }, [projectStore.listProject]);

  return (
    <div>
      <NavbarAccueil />
      <div className={classes.root}>
        <Corps />
      </div>

      
      
    </div>
  );
};

export default Accueil;
