import axios from "axios";
import { TNotification } from "../types/Notification";
import base_uri from "../utils";
import NotificationStore from "../store/NotificationStore";
import UserStore from "../store/UserStore";

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
    // const project = localStorage.getItem("Project_id");
    const { user } = UserStore.getState();
    const { idProject } = user;
    if (idProject) {
      const result = await axios.get(
        `${base_uri.base_uri}/notification/${idProject}`
      );
      NotificationStore.setState({ notifLength: result.data.count });
      return {
        count: result.data.count,
        notification: result.data.notif,
      };
    }
    return {
      count: 0,
      notification: [],
    };
  } catch (error) {
    console.log("Internal server error");
  }
};

// Fonction pour récupérer les notifications des sprints à venir
export const getUpcomingSprintsNotifications = async () => {
  try {
    const result = await axios.get(`${base_uri.base_uri}/notification/notifyUpcomingSprints`);
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};
