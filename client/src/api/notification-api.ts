import axios from "axios";
import { TNotification } from "../types/Notification";
import base_uri from "../utils";
import NotificationStore from "../store/NotificationStore";

const URL = {
  notification: "notification",
};
export const createNotification = async (data: TNotification) => {
  try {
    const result = await axios.post(
      `${base_uri.base_uri}/${URL.notification}`,
      data
    );
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};

export const deleteNotification = async (id: string) => {
  try {
    const result = await axios.put(`${base_uri.base_uri}/notification/${id}`);
  } catch (error) {
    console.log("Internal server error");
  }
};

export const lengthNotification = async () => {
  try {
    const project = localStorage.getItem("Project_id");
    if (project) {
      const result = await axios.get(
        `${base_uri.base_uri}/notification/${project}`
      );
      NotificationStore.setState({ notifLength: result.data.count });
      return result.data.count;
    }
    return 0;
  } catch (error) {
    console.log("Internal server error");
  }
};
