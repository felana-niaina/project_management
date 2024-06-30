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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TSprint } from "../../types/Sprint";
import BacklogStore from "../../store/BacklogStore";
import { getAllBacklog } from "../../api/backlog-api";
import { TBacklog } from "../../types/Backlog";
import { createSprint, getAllSprint } from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import UserStore from "../../store/UserStore";
import { TInvitation } from "../../types/MailInvitation";
import { sendInvitation } from "../../api/mailInvitation-api";
const SprintPlanning = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const idProject = projectId || "";
  const [open, setOpen] = useState(false);
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
    console.log("value backlog",value)
    const selectedIds = value as string[];
    console.log("selectedIds", selectedIds)
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
      };

      await createSprint(sprintData, idProject);
      setFormData({
        id: "",
        idProject: idProject,
        name: "",
        startDate: "",
        endDate:""
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

  const inviteScrum = async () => {};

  return (
    <div>
      <TableContainer component={Paper} className="m-4 p-5 me-10">
        <form>
          <table className="table-fixed border-collapse border border-slate-400">
            <caption className="caption-top text-center">
              Sprint Backlog du projet
            </caption>
            <thead>
              <tr>
                <th className="border border-slate-300">Id</th>
                <th className="border border-slate-300">Name sprint</th>
                <th className="border border-slate-300">Start date</th>
                <th className="border border-slate-300">End date</th>
              </tr>
            </thead>
            <tbody>
              
              {sprintList.result.map((row, index) => (
                <tr key={index}>
                  <td className="border border-slate-300">{row.id}</td>
                  {/* <td className="border border-slate-300">
                    {row.backlog.map((item: string, idx: number) => (
                      <div key={idx}>
                        {
                          backlogList.result.find(
                            (backlog) => backlog.id === item
                          )?.id
                        }
                      </div>
                    ))}
                  </td> */}
                  <td className="border border-slate-300">{row.name}</td>
                  <td className="border border-slate-300">{row.startDate}</td>
                  <td className="border border-slate-300">{row.endDate}</td>

                </tr>
              ))}
              {userStore.user.role?.name == "PRODUCT OWNER" && (
                <tr>
                  {/* <td className="border border-slate-300"> */}
                    
                    {/* <Select
                      onChange={handleSelectChange}
                      size="small"
                      name="sprint"
                      value={formData.sprint}
                    ></Select> */}
                  {/* </td> */}
                  <td className="border border-slate-300">
                    <TextField
                      name="id"
                      onChange={handleInputChange}
                      size="small"
                      value={formData.id}
                    />
                  </td>
                  {/* <td className="border border-slate-300">
                    <FormControl fullWidth>
                      <Select
                        name="backlog"
                        multiple
                        value={formData.backlog}
                        onChange={handleSelectChange}
                        renderValue={() => (
                          <ul
                            style={{
                              padding: 0,
                              margin: 0,
                              listStyleType: "disc",
                              paddingLeft: "20px",
                            }}
                          >
                            {selectedBacklogs.map((epic) => (
                              <li key={epic}>{epic}</li>
                            ))}
                          </ul>
                        )}
                      >
                        {backlogList.result.map((backlog: TBacklog) => (
                          <MenuItem key={backlog.id} value={backlog.id}>
                            {backlog.epic}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </td> */}
                  <td className="border border-slate-300">
                    <TextField
                      name="name"
                      onChange={handleInputChange}
                      size="small"
                      value={formData.name}
                    />
                  </td>
                  <td className="border border-slate-300">
                    <TextField
                      name="startDate"
                      type="date"
                      onChange={handleInputChange}
                      size="small"
                      value={formData.startDate}
                    />
                  </td>
                  <td className="border border-slate-300">
                    <TextField
                      type="date"
                      name="endDate"
                      onChange={handleInputChange}
                      size="small"
                      value={formData.endDate}
                    />
                  </td>
                  
                </tr>
              )}
            </tbody>
          </table>
          <div className="mt-2">
            {userStore.user.role?.name == "PRODUCT OWNER" && (
              <Button
                onClick={handleValidate}
                variant="contained"
                style={{ backgroundColor: "#f50057", color: "#fff" }}
              >
                Add +
              </Button>
            )}
          </div>
        </form>
        <div>
          {userStore.user.role?.name == "PRODUCT OWNER" && (
            <Button
              onClick={handleClose}
              variant="contained"
              style={{ backgroundColor: "#f50057", color: "#fff" }}
            >
              Invite a scrum manager
            </Button>
          )}
        </div>
      </TableContainer>
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
    </div>
  );
};

export default SprintPlanning;
