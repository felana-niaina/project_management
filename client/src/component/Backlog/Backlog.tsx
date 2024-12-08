import {
  Button,
  Paper,
  SelectChangeEvent,
  TableContainer,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createBacklog } from "../../api/backlog-api";
import { getAllBacklog } from "../../api/backlog-api";
import { TBacklog } from "../../types/Backlog";
import BacklogStore from "../../store/BacklogStore";
import SprintStore from "../../store/SprintStore";
import { getAllSprint } from "../../api/sprint-api";
import { TSprint } from "../../types/Sprint";
import { TProject } from "../../types/Project";
import { getListProject, getSelectedProject } from "../../api/project-api";
import ProjectStore from "../../store/StoreProject";

const Backlog = () => {
  const projectStore: any = ProjectStore();
  const { id: projectId } = useParams<{ id: string }>();
  // const idProject = projectId || "";
  const [listProject, setListProject] = useState<TProject[] | []>([]);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectStore.listProject.length > 0 ? projectStore.listProject[0]._id : ""
  );
  // const [backlogList, setBacklogList] = useState<TBacklog[]>([]);
  const [backlogList, setBacklogList] = useState<{ result: TBacklog[] }>({
    result: [],
  });
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [selectedSprint, setSelectedSprint] = useState<string[]>([]);

  const [backlogItem, setBacklogItem] = useState<TBacklog>({
    id: "",
    idProject: selectedProject, // Utilisation de l'ID du projet dans les données du backlog
    epic: "",
    userStory: "",
    priority: "",
    cout: "",
    task: "",
    sprint: "",
    status: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setBacklogItem((prevBacklogItem) => ({
      ...prevBacklogItem,
      [name]: value,
    }));
  };

  const handleValidate = async () => {
    try {
      await createBacklog(backlogItem, selectedProject);
      setBacklogItem({
        id: "",
        idProject: selectedProject,
        epic: "",
        userStory: "",
        priority: "",
        cout: "",
        sprint: "",
        task: "",
        status: "",
      });
      fetchBacklogs(); // Fetch backlogs again after creating a new one
    } catch (error) {
      console.error("Error creating backlog:", error);
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: any = event.target.value;
    console.log("value backlog", value);

    setBacklogItem({
      ...backlogItem,
      sprint: value,
    });
    setSelectedSprint(value);
  };
  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(selectedProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };
  const fetchBacklogs = async () => {
    try {
      const backlogData = await getAllBacklog(selectedProject);
      BacklogStore.getState().setListBacklog(backlogData);
      setBacklogList(backlogData);
    } catch (error) {
      console.error("Error fetching backlog:", error);
    }
  };
  const handleSelectChangeProject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = event.target.value;
    setSelectedProject(selectedProjectId);
    console.log("Projet sélectionné:", selectedProjectId);
    // Vous pouvez gérer l'action ici.
  };

  useEffect(() => {
    if (selectedProject) {
      fetchBacklogs();
      fetchSprint();
    }
  }, [selectedProject]);

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

  useEffect(() => {
    if (selectedProject) {
      fetchBacklogs();
      fetchSprint();
    }
  }, [selectedProject]);

  console.log("backlogList::", backlogList);
  console.log("idProjectProductBacklog", projectId);
  return (
    <div>
      <div className="p-3">
        <select
          value={selectedProject}
          onChange={handleSelectChangeProject}
          style={{
            padding: "32px",
            backgroundColor: "#E2E8FC",
            color: "#192652",
          }}
        >
          {projectStore.listProject.map((project: TProject | any) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <TableContainer component={Paper} className="m-4 p-5 me-10">
        <form action="">
          <table className="table-fixed border-collapse border border-slate-400">
            <caption className="caption-top text-center">
              Cahier du backlog du projet
            </caption>
            <thead>
              <tr>
                <th className="border border-slate-300">N°</th>
                <th className="border border-slate-300">User story</th>
                <th className="border border-slate-300">Description</th>
                <th className="border border-slate-300">Tâches</th>
                <th className="border border-slate-300">Priorité</th>
                <th className="border border-slate-300">Estimation</th>
                <th className="border border-slate-300">Sprint</th>
                {/* <th className="border border-slate-300">Estimation (j)</th> */}
              </tr>
            </thead>
            <tbody>
              {backlogList.result.map((backlog: TBacklog | any) => (
                <tr key={backlog.id}>
                  <td className="border border-slate-300">{backlog.id}</td>
                  <td className="border border-slate-300">
                    {backlog.userStory}
                  </td>
                  <td className="border border-slate-300">{backlog.epic}</td>
                  <td className="border border-slate-300">{backlog.task}</td>
                  <td className="border border-slate-300">
                    {backlog.priority}
                  </td>
                  <td className="border border-slate-300">{backlog.cout}</td>
                  <td className="border border-slate-300">{backlog.sprint}</td>
                  {/* <td className="border border-slate-300">
                    {backlog.cout}
                  </td> */}
                </tr>
              ))}
              <tr>
                <td className="border border-slate-300">
                  <TextField
                    name="id"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.id}
                  />
                </td>

                <td className="border border-slate-300">
                  <TextField
                    name="userStory"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.userStory}
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="epic"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.epic}
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="task"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.task}
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="priority"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.priority}
                  />
                </td>

                <td className="border border-slate-300">
                  <TextField
                    name="cout"
                    onChange={handleInputChange}
                    size="small"
                    value={backlogItem.cout}
                  />
                </td>
                <td className="border border-slate-300">
                  <select
                    name="sprint"
                    onChange={handleSelectChange}
                    value={backlogItem.sprint}
                  >
                    <option value=""></option>
                    {(sprintList as any).result.map((sprint: any) => (
                      <option key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-2">
            <Button
              onClick={handleValidate}
              variant="contained"
              style={{ backgroundColor: "#f50057", color: "#fff" }}
            >
              Ajouter +
            </Button>
          </div>
        </form>
      </TableContainer>
    </div>
  );
};

export default Backlog;
