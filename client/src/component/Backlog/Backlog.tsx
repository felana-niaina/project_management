import { Button, Paper, TableContainer, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createBacklog } from "../../api/backlog-api";
import { getAllBacklog } from "../../api/backlog-api";
import { TBacklog } from "../../types/Backlog";
import BacklogStore from "../../store/BacklogStore";

const Backlog = () => {
  const { id: projectId } = useParams<{ id: string }>();
  console.log('useParams:', useParams());
  const idProject = projectId || "";
  // const [backlogList, setBacklogList] = useState<TBacklog[]>([]);
  const [backlogList, setBacklogList] = useState<{ result: TBacklog[] }>({ result: [] });
  const [backlogItem, setBacklogItem] = useState<TBacklog>({
    id: "",
    idProject: idProject, // Utilisation de l'ID du projet dans les données du backlog
    epic: "",
    userStory: "",
    priority: "",
    cout: "",
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
      await createBacklog(backlogItem,idProject);
      setBacklogItem({
        id: "",
        idProject: idProject,
        epic: "",
        userStory: "",
        priority: "",
        cout: "",
      });
      fetchBacklogs(); // Fetch backlogs again after creating a new one
    } catch (error) {
      console.error("Error creating backlog:", error);
    }
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

  useEffect(() => {
    if (idProject) {
      fetchBacklogs();
    }
  }, [idProject]);

  console.log("backlogList::",backlogList)
  console.log("idProjectProductBacklog",projectId)
  return (
    <div>
      <TableContainer component={Paper} className="m-4 p-5 me-10">
        <form action="">
          <table className="table-fixed border-collapse border border-slate-400">
            <caption className="caption-top text-center">
              Cahier du backlog du projet
            </caption>
            <thead>
              <tr>
                <th className="border border-slate-300">ID</th>
                <th className="border border-slate-300">Epic</th>
                <th className="border border-slate-300">User story</th>
                <th className="border border-slate-300">Priorité</th>
                <th className="border border-slate-300">Coût</th>
              </tr>
            </thead>
            <tbody>
              {backlogList.result.map((backlog: TBacklog | any) => (
                <tr key={backlog.id}>
                  <td className="border border-slate-300">{backlog.id}</td>
                  <td className="border border-slate-300">{backlog.epic}</td>
                  <td className="border border-slate-300">
                    {backlog.userStory}
                  </td>
                  <td className="border border-slate-300">
                    {backlog.priority}
                  </td>
                  <td className="border border-slate-300">{backlog.cout}</td>
                </tr>
              ))}
              <tr>
                <td className="border border-slate-300">
                  <TextField
                    name="id"
                    onChange={handleInputChange}
                    size="small"
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="epic"
                    onChange={handleInputChange}
                    size="small"
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="userStory"
                    onChange={handleInputChange}
                    size="small"
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="priority"
                    onChange={handleInputChange}
                    size="small"
                  />
                </td>
                <td className="border border-slate-300">
                  <TextField
                    name="cout"
                    onChange={handleInputChange}
                    size="small"
                  />
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
              Add +
            </Button>
          </div>
        </form>
      </TableContainer>
    </div>
  );
};

export default Backlog;
