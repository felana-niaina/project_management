import axios from "axios";
import { TSprint } from "../types/Sprint"; 
import base_uri from "../utils"

export const createSprint = async (data: TSprint,idProject:any) => {
  try {
    console.log('dataSprint::::',data)
    const result = await axios.post(`${base_uri.base_uri}/sprint/${idProject}`, {
        data,
      });
    
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};

export const getAllSprint = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };


