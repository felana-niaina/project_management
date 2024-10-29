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

export const updateSprint = async (data: TSprint,idProject: string) => {
  try {
    const result = await axios.patch(`${base_uri.base_uri}/sprint/${idProject}`, data);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const deleteSprint = async (idProject: string, sprintId :any) => {
  try {
    const result = await axios.put(`${base_uri.base_uri}/sprint/${idProject}`, null, {
      params: {
        sprintId: sprintId
      }
    });
    return result;
  } catch (error: any) {
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

export const getCardCountsForSprints = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/column/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };

export const getUpcomingTasks = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/upcoming/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };

export const getTotalTaskCountsForProject = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/totalTaskCounts/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };
  
export const getTaskCountsForChart = async (idProject:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/taskCountsForChart/${idProject}`);
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };

export const updateSprintStatus = async (idProject:any,sprintId:any , action:string) => {
    try {
      const result = await axios.post(`${base_uri.base_uri}/sprint/${idProject}/updateSprintStatus`, {
        sprintId,
        action
      });
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };

export const getUsersForSprint = async (idProject:any,sprintId:any) => {
    try {
      const result = await axios.get(`${base_uri.base_uri}/sprint/${idProject}/getUsersForSprint`, {
        params: { sprintId },
      });
      return result.data;
    } catch (error: any) {
      console.log("Internal server error");
    }
  };


