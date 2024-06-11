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
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Code from '@mui/icons-material/Code';
import DoneIcon from '@mui/icons-material/Done';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { createProject, getListProject, getSelectedProject } from "../../api/project-api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


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
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
  const handleDateChange = (date: Date | any) => {
    setSelectedDate(date);
  };
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
  const newProject =()=>{
    console.log("hello");
    setOpenNewProject(!openNewProject);
  }
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
  const showChart = (projectId: string) => {
    setSelectedProjectId(projectId);
    setOpen(true);
  };
  interface ProjectChartProps {
    columns: TColumn[];
  }

  const ProjectChart: React.FC<ProjectChartProps> = ({ columns }) => {
    console.log("columns::::,",columns);
    const data = {
      labels: columns.map((column) => column.name),
      datasets: [
        {
          label: 'Nombre de cartes',
          data: columns.map((column:any) => column.cards ? column.cards.length : 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Nombre de cartes',
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  useEffect(() => {
    async function fetchColumns() {
      const columnsData: { [projectId: string]: TColumn[] } = {};
      for (const project of projectStore.listProject as TProject[] | any) {
        try {
          const columns = await getAllColumn(project._id);
          console.log("columns:::::", columns);

          columnsData[project._id] = columns;
        } catch (error) {
          console.error(
            `Error fetching columns for project ${project._id}:`,
            error
          );
        }
      }
      setColumns(columnsData);
      console.log("columnsDAta :::", columnsData);
    }

    if (projectStore.listProject.length > 0) {
      fetchColumns();
    }
  }, [projectStore.listProject]);
  
  useEffect(() => {
    const getList = async () => {
      await getListProject();
      await getSelectedProject();
    };
    getList();
  }, []);

  useEffect(() => {
    setListProject(projectStore.listProject);
  }, [projectStore.listProject]);
  
  
  return (
    <div>
      {!hasProject ? (
        <>
          <NavbarAccueil />
          <div className={classes.root}>
            <Corps />
          </div>
        </>
      ) : (
        <div className={classes.root}>
          <div>
            <div className={classes.bienvenu}>
              <Typography className={classes.typographySalutation}>
                Bienvenue dans votre espace de gestion de projet !
              </Typography>
              <Typography className={classes.typographyInvitation}>
                Lancez-vous en créant votre projet. Invitez vos
                collègues, assignez des tâches et faites avancer vos projets
                vers le succès.
              </Typography>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.add} onClick={newProject}>
              <span className={classes.addSpanPlus}>+</span>
              <span className={classes.addSpan}>new project</span>
            </div>
            {projectStore.listProject.map((project: TProject | any) => (
              
              <div key={project._id} className={classes.cardContent} >
                <div>
                  <Typography style={{ color: "#192652" , backgroundColor:"#E2E8FC", padding:"10px",marginBottom:"10px" }}>
                    {project.name}
                  </Typography>
                </div>
                <div>
                  <div>
                    {columns[project._id] &&
                      (columns[project._id] as any).result
                        .filter((column: any) =>
                          [
                            "A faire",
                            "En cours",
                            "Code revue",
                            "Terminé",
                          ].includes(column.name)
                        )
                        .map((filteredColumn: any) => {
                          const aliasMap: { [key: string]: JSX.Element } = {
                            "A faire": <CheckBoxOutlineBlankIcon />,
                            "En cours": <HourglassEmptyIcon />,
                            "Code revue": <Code   sx={{ background: 'none !important' }} />,
                            "Terminé": <DoneIcon />,
                          };

                          const icon = aliasMap[filteredColumn.name];
                          return (
                            <div key={filteredColumn._id}>
                              <div className={classes.tasksName}>
                                <div>{icon}</div>
                                <div>
                                  <Typography>{filteredColumn.name}</Typography>
                                </div>
                                <div>
                                  <Typography>
                                    {filteredColumn.cards
                                      ? filteredColumn.cards.length
                                      : 0}
                                  </Typography>
                                </div>
                                
                              </div>
                            </div>
                          );
                    })}
                  </div>
                  <div style={{display:"flex",justifyContent:"end",marginTop:"25px"}}><Button onClick={() => showChart(project._id)} style={{backgroundColor:"#30499C",color:"#FFFFFF",fontSize:"0.75rem"}}>Learn more</Button></div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Dialog open={openNewProject} onClose={handleCloseProject}>
        <DialogTitle>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <IconButton>
                <AddCircleIcon color="primary" />
              </IconButton>
            </Grid>
            <Grid item>
              Intitulé du nouveau projet
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
        <Typography variant="body1" gutterBottom>
          Veuillez entrer le nom de votre nouveau projet dans le champ ci-dessous. Assurez-vous de choisir un nom unique et descriptif.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
                name="name"
                onChange={handleChange}
                value={name}
                label="Nom du projet"
                fullWidth
              />
            <Typography variant="body2" color="textSecondary">
              Exemple: "Refonte du site web", "Développement de l'application mobile", etc.
            </Typography>
          </Grid>

            
        </Grid>
          
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleCloseProject}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleValidate}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Vue détaillée du projet</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Nom du projet : {listProject.find((project : any) => project._id === selectedProjectId)?.name}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Détails du projet :
          </Typography>
          <div id={`chart-container-${selectedProjectId}`} style={{ width: '500px', height: '200px' }}>
            {columns[selectedProjectId] && Array.isArray((columns[selectedProjectId]as any).result) && (
              <ProjectChart columns={(columns[selectedProjectId]as any).result} />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Accueil;
