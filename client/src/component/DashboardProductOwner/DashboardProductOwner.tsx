import React, { useEffect, useState } from "react";
import { getListProject, getSelectedProject } from "../../api/project-api";
import { TProject } from "../../types/Project";
import ProjectStore from "../../store/StoreProject";
import { Paper, TableContainer, Typography } from "@mui/material";
import { getUsersByProjectId } from "../../api/user-api";
import { TUser } from "../../types/User";

const DashboardProductOwner = () => {
  const projectStore: any = ProjectStore();
  const [listProject, setListProject] = useState<TProject[] | []>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>(
    projectStore.listProject.length > 0 ? projectStore.listProject[0]._id : ""
  );

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectId = event.target.value;
    setSelectedProject(selectedProjectId);
    console.log("Projet sélectionné:", selectedProjectId);
    // Vous pouvez gérer l'action ici.
  };

  useEffect(() => {
    const getList = async () => {
      await getListProject();
      await getSelectedProject();
    };
    getList();
  }, []);

  useEffect(() => {
    // Met à jour la liste locale des projets
    setListProject(projectStore.listProject);

    // Préselectionne le premier projet si la liste n'est pas vide
    if (projectStore.listProject.length > 0) {
      const firstProjectId = projectStore.listProject[0]._id;
      setSelectedProject(firstProjectId);
    }
  }, [projectStore.listProject]);

  // Récupérer les utilisateurs à chaque changement de projet sélectionné
  useEffect(() => {
    const fetchUsers = async () => {
      if (selectedProject) {
        try {
          const response = await getUsersByProjectId(selectedProject);
          setUsers(response?.data?.result || []); // Assurez-vous que les données sont dans le bon format
          console.log("Utilisateurs récupérés :", response?.data?.result);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des utilisateurs :",
            error
          );
        }
      }
    };
    fetchUsers();
  }, [selectedProject]);

  return (
    <div>
      <div className="p-3">
        <select
          value={selectedProject}
          onChange={handleSelectChange}
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
      <div>
        <TableContainer
          component={Paper}
          className=" flex justify-center m-4 p-5 me-10"
        >
          <form>
            <table className="table-fixed border-collapse border border-slate-400 w-full">
              <caption className="caption-top text-center">
                Récapitulation du projet pour ses ressources
              </caption>
              <thead>
                <tr className="text-center">
                  <th className="border border-slate-300 ">Collaborateur</th>
                  <th className="border border-slate-300  ">Sprint</th>
                  <th className="border border-slate-300  ">
                    Heures Travaillées
                  </th>
                  <th className="border border-slate-300  ">
                    Tâches Complétées
                  </th>
                  <th className="border border-slate-300  ">
                    Taux d'Avancement
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user:TUser | any) => (
                  <tr className="text-center" key={user._id}>
                    <td className="border border-slate-300">
                      {user.firstname} {user.lastname} {/* Assurez-vous que le champ correspond */}
                    </td>
                    <td className="border border-slate-300">Sprint 1</td>
                    <td className="border border-slate-300">15h</td>
                    <td className="border border-slate-300">5/6</td>
                    <td className="border border-slate-300">83%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
        </TableContainer>
      </div>
    </div>
  );
};

export default DashboardProductOwner;
