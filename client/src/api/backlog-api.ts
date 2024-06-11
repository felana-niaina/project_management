import axios from "axios";
import { TBacklog } from "../types/Backlog";
import base_uri from "../utils";
import BacklogStore from "../store/BacklogStore";


export const createBacklog = async (data: TBacklog,idProject:any) => {
  try {
    console.log('idProject backlog client::::',idProject)
    const result = await axios.post(`${base_uri.base_uri}/backlog/${idProject}`, {
        data,
      });
    // const result = await axios.post(
    //   `${base_uri.base_uri}/backlog/${idProject}`,{data}
    // );
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};

export const getAllBacklog = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/backlog/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };


