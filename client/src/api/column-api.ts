import configUrl from "../utils";
import { TColumn } from "../types/Column";
import axios from "axios";
import ProjectStore from "../store/StoreProject";

// const projectStore = ProjectStore();
export const getAllColumn = async (idProject?: string) => {
  // console.log(projectStore.project);
  // export const getAllColumn = async () => {
  // console.log(idProject);
  try {
    // const result = await axios.get(`${configUrl.base_uri}/column`);
    const result = await axios.get(`${configUrl.base_uri}/column/${idProject}`);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const createColumn = async (data: TColumn, projectName: string) => {
  try {
    const result = await axios.post(`${configUrl.base_uri}/column`, {
      data,
      projectName,
    });
    console.log("result ;", result);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const updateColumn = async (data: TColumn, id?: string) => {
  try {
    const result = await axios.patch(`${configUrl.base_uri}/column/${id}`, {
      data,
    });
    return result;
  } catch (error: any) {
    console.error(
      "Error updating column:",
      error.response?.data || error.message
    );
    throw new Error("Internal server error");
  }
};

export const deleteColumn = async (id: string) => {
  try {
    const result = await axios.put(`${configUrl.base_uri}/column/${id}`);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};
