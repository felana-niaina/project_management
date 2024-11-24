import {
  Button,
  MenuItem,
  Paper,
  TableContainer,
  TextField,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogActions,
  Modal,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TSprint } from "../../types/Sprint";
import BacklogStore from "../../store/BacklogStore";
import { getAllBacklog } from "../../api/backlog-api";
import { TBacklog } from "../../types/Backlog";
import {
  createSprint,
  deleteSprint,
  getAllSprint,
  updateSprint,
  getUsersForSprint,
} from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import UserStore from "../../store/UserStore";
import { TInvitation } from "../../types/MailInvitation";
import { sendInvitation } from "../../api/mailInvitation-api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TUser } from "../../types/User";
import configUrl from "../../utils";
import defaultImage from "../../assets/profil.png";

const SprintPlanning = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const idProject = projectId || "";
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<TSprint | null>(null);
  const [usersSprint, setUsersSprint] = useState<any>([]);
  const [selectedDeleteSprint, setSelectedDeleteSprint] = useState<
    TSprint | any
  >();
  const [mail, setMail] = useState("");
  const handleClose = () => {
    setOpen(!open);
    if (open) {
      setMail("");
    }
  };
  const [backlogList, setBacklogList] = useState<{ result: TBacklog[] }>({
    result: [],
  });
 
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [formData, setFormData] = useState<TSprint>({
    id: "",
    idProject: idProject,
    name: "",
    startDate: "",
    endDate: "",
    column: [],
  });
  const [selectedBacklogs, setSelectedBacklogs] = useState<string[]>([]);

  const userStore = UserStore();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    console.log("value backlog", value);
    const selectedIds = value as string[];
    console.log("selectedIds", selectedIds);
    const selectedEpics = selectedIds.map(
      (id) => backlogList.result.find((item) => item.id === id)?.epic || id
    );
    // setFormData({
    //   ...formData,
    //   backlog: selectedIds,
    // });
    // console.log("backlogs:::", formData.backlog)
    // setSelectedBacklogs(selectedEpics);
  };

  const fetchBacklogs = async () => {
    try {
      const backlogData = await getAllBacklog(idProject);
      BacklogStore.getState().setListBacklog(backlogData);
      setBacklogList(backlogData);
    } catch (error) {
      console.error("Error fetching backlog:", error);
    }
  };

  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(idProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  useEffect(() => {
    if (idProject) {
      fetchBacklogs();
      fetchSprint();
    }
  }, [idProject]);

  const handleValidate = async () => {
    try {
      const sprintData: TSprint = {
        id: formData.id,
        idProject: formData.idProject,
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        column: [],
      };

      await createSprint(sprintData, idProject);
      setFormData({
        id: "",
        idProject: idProject,
        name: "",
        startDate: "",
        endDate: "",
        column: [],
      });
      setSelectedBacklogs([]);
      fetchBacklogs(); // Fetch backlogs again after creating a new one
      fetchSprint(); // Fetch sprints again after creating a new one
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };
  const id_project = localStorage.getItem("Project_id");
  const name_project = localStorage.getItem("Project_name");

  const handleChange = (e: any) => {
    setMail(e.target.value);
  };
  const data: TInvitation = {
    idProject: id_project,
    nameProject: name_project,
    role: "665ebcee60d523021b042a6d",
    mail: mail,
  };
  const handleInvite = async () => {
    await sendInvitation(data);
    handleClose();
  };

  const handleEdit = (sprint: TSprint) => {
    setSelectedSprint(sprint);
    setEditOpen(true);
  };

  const handleDelete = (sprint: TSprint) => {
    setSelectedDeleteSprint(sprint);
    console.log("delete", selectedDeleteSprint);
    setDeleteOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedSprint(null);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEditSubmit = async () => {
    if (selectedSprint) {
      try {
        await updateSprint(selectedSprint, idProject);
        handleEditClose();
        fetchSprint();
      } catch (error) {
        console.error("Error updating sprint:", error);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedDeleteSprint) {
      try {
        await deleteSprint(selectedDeleteSprint._id, idProject);
        handleDeleteClose();
        fetchSprint();
      } catch (error) {
        console.error("Error deleting sprint:", error);
      }
    }
  };
  const handleRowClick = async (row: any) => {
    console.log("row ::::", row);
    try {
      const usersForSprint = await getUsersForSprint(idProject, row._id);
      console.log("usersForSprint (from API):", usersForSprint); // Vérifiez que les données sont correctes

      setUsersSprint(usersForSprint);
      setSelectedRow(row);
      setOpenModal(true);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des utilisateurs du sprint:",
        error
      );
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRow(null);
  };
  useEffect(() => {
    console.log("selectedRow ::::", selectedRow);
  }, [selectedRow]);
  useEffect(() => {
    console.log("selectedusersSprint ::::", usersSprint);
  }, [usersSprint]);

  return (
    <div className="flex justify-center flex-col">
      <TableContainer
        component={Paper}
        className=" flex justify-center m-4 p-5 me-10"
      >
        <form>
          <table className="table-fixed border-collapse border border-slate-400 w-full">
            <caption className="caption-top text-center">
              Sprint Backlog du projet
            </caption>
            <thead>
              <tr className="text-center">
                <th className="border border-slate-300 w-[10%] ">Id</th>
                <th className="border border-slate-300  ">Nom du sprint</th>
                <th className="border border-slate-300  ">Date de début</th>
                <th className="border border-slate-300  ">Date fin</th>
                <th className="border border-slate-300  ">Statut</th>
              </tr>
            </thead>
            <tbody>
              {sprintList.result.map((row: any, index) => (
                <tr
                  key={index}
                  className="text-center"
                  onClick={() => handleRowClick(row)}
                >
                  <td className="border border-slate-300">{row.id}</td>

                  <td className="border border-slate-300">{row.name}</td>
                  <td className="border border-slate-300">{row.startDate}</td>
                  <td className="border border-slate-300">{row.endDate}</td>
                  <td className="border border-slate-300">{row.status}</td>
                  {userStore.user.role?.name == "PRODUCT OWNER" && (
                    <td className="border border-slate-300">
                      <EditIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(row)} // Ajoutez cette ligne si vous avez une fonction pour gérer l'édition
                      />
                    </td>
                  )}
                  {userStore.user.role?.name == "PRODUCT OWNER" && (
                    <td className="border border-slate-300">
                      <DeleteIcon
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(row)} // Ajoutez cette ligne si vous avez une fonction pour gérer l'édition
                      />
                    </td>
                  )}
                </tr>
              ))}
              {userStore.user.role?.name == "PRODUCT OWNER" && (
                <tr>
                  <td className="border border-slate-300">
                    <TextField
                      name="id"
                      onChange={handleInputChange}
                      value={formData.id}
                    />
                  </td>

                  <td className="border border-slate-300">
                    <TextField
                      name="name"
                      onChange={handleInputChange}
                      value={formData.name}
                    />
                  </td>
                  <td className="border border-slate-300">
                    <TextField
                      name="startDate"
                      type="date"
                      variant="outlined"
                      onChange={handleInputChange}
                      value={formData.startDate}
                      InputProps={{
                        sx: {
                          border: "none",
                          "&:before": {
                            border: "none", // Enlève la bordure inférieure (pour "outlined")
                          },
                          "&:after": {
                            border: "none", // Enlève la bordure inférieure (pour "outlined")
                          },
                        },
                      }}
                    />
                  </td>
                  <td className="border border-slate-300">
                    <TextField
                      type="date"
                      name="endDate"
                      onChange={handleInputChange}
                      value={formData.endDate}
                    />
                  </td>

                  <td>
                    <div className="m-2 flex justify-between text-center">
                      <Button
                        onClick={handleValidate}
                        variant="contained"
                        style={{ backgroundColor: "#f50057", color: "#fff" }}
                      >
                        Ajouter +
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </TableContainer>
      <div className="mt-5 ml-5">
        {userStore.user.role?.name == "PRODUCT OWNER" && (
          <Button
            onClick={handleClose}
            variant="contained"
            style={{ backgroundColor: "#f50057", color: "#fff" }}
          >
            Inviter un scrum master
          </Button>
        )}
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Invitation adressé à :</DialogTitle>
        <DialogContent>
          <br />
          <TextField
            name="mail"
            onChange={handleChange}
            value={mail}
            label="email adress"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleInvite}>
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for editing sprint */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Modifier le Sprint</DialogTitle>
        <DialogContent>
          {selectedSprint && (
            <>
              <TextField
                margin="dense"
                label="Nom"
                name="name"
                value={selectedSprint.name}
                onChange={(e) =>
                  setSelectedSprint({
                    ...selectedSprint,
                    name: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                margin="dense"
                label="Date de début"
                name="startDate"
                type="date"
                value={selectedSprint.startDate}
                onChange={(e) =>
                  setSelectedSprint({
                    ...selectedSprint,
                    startDate: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                margin="dense"
                label="Date de fin"
                name="endDate"
                type="date"
                value={selectedSprint.endDate}
                onChange={(e) =>
                  setSelectedSprint({
                    ...selectedSprint,
                    endDate: e.target.value,
                  })
                }
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for deleting sprint */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Supprimer ce Sprint</DialogTitle>
        <DialogContent>
          <h3>Etes vous sûr de vouloir supprimer ce sprint ?</h3>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleDeleteSubmit} color="primary">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal pour afficher les détails de la ligne sélectionnée */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="modal-content">
          <Card
            style={{
              padding: "20px",
              maxWidth: "500px",
              margin: "auto",
              marginTop: "10%",
            }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Détails du Sprint
              </Typography>
              {selectedRow && Object.keys(selectedRow).length > 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Nom:</strong> {selectedRow.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Date de début:</strong> {selectedRow.startDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Date de fin:</strong> {selectedRow.endDate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <strong>Statut:</strong> {selectedRow.status}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <div>
                        <h2>Utilisateurs pour le sprint {selectedRow.id}</h2>
                        <ul>
                          {usersSprint.map((user: any) => (
                            <li key={user._id}>
                              <Grid>
                                <img
                                  src={
                                    user.image
                                      ? `${configUrl.base_uri}/file/${user.image}`
                                      : defaultImage
                                  }
                                  alt="profile"
                                  width={30}
                                  height={30}
                                />
                              </Grid>
                              {user.firstname} {user.lastname} ({user.email})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="body1">
                  Aucune donnée disponible
                </Typography>
              )}
              <Button
                onClick={handleCloseModal}
                color="primary"
                style={{ marginTop: "20px" }}
              >
                Fermer
              </Button>
            </CardContent>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default SprintPlanning;
