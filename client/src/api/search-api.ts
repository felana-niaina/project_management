import configUrl from "../utils";
import axios from "axios";
import ProjectStore from "../store/StoreProject";
import { TProject } from "../types/Project";

const projectStore = ProjectStore.getState();

export const getCardBySearch: any = async (text: string) => {
  try {
    const id = localStorage.getItem("Project_id");
    const result: any = await axios.post(`${configUrl.base_uri}/card/search`, {
      text,
      id,
    });

    console.log("search api ;", result.data.resultProject);
    projectStore.setProject({
      name: result.data.resultProject[0].name,
      startDate: result.data.resultProject[0].startDate,
      endDate: result.data.resultProject[0].endDate,
      description: result.data.resultProject[0].description,
      column: result.data.resultProject[0].column,
    });
    // return result.data;
  } catch (error: any) {
    console.log("Internal server error");
  }
};
