import axios from "axios";
import base_uri from "../utils";
import ProjectStore from "../store/StoreProject";
import { jwtDecode } from "jwt-decode";

const URL = {
  project: "project",
  selectedProject: "project/selectedProject",
  listProject: "project/listProject",
};

const projectStore = ProjectStore.getState();

export const getAllProject = async () => {
  try {
    const result = await axios.get(`${base_uri.base_uri}/${URL.project}`);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const createProject = async (data: string) => {
  const created = await axios.post(`${base_uri.base_uri}/${URL.project}`, {
    data,
  });
  return created;
};

export const getSelectedProject = async () => {
  try {
    const idProject = localStorage.getItem("Project_id");
    if (idProject) {
      const result = await axios.get(
        `${base_uri.base_uri}/${URL.selectedProject}/${idProject}`
      );
      if (result.data) {
        projectStore.setProject(result.data);
      }
    }
  } catch (error) {
    console.log("Erreur lors de getSelectedProject");
  }
};

export const getListProject = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const { id } = jwtDecode(token) as any;
      const listProject = await axios.get(
        `${base_uri.base_uri}/${URL.listProject}/${id}`
      );
      if (listProject) {
        projectStore.setListProject(listProject.data);
      }
    }
  } catch (error) {
    console.log("Erreur lors de getSelectedProject");
  }
};
