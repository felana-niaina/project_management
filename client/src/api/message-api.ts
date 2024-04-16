import axios from "axios";
import base_uri from "../utils";
import { TMessage } from "../types/Message";
import { getMe } from "./user-api";
import UserStore from "../store/UserStore";

const URL = {
  message: "message",
};

const userStore = UserStore();
export const createMessage = async (data: TMessage) => {
  try {
    const result = await axios.post(
      `${base_uri.base_uri}/${URL.message}`,
      data
    );
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};

export const deleteMessage = async (id: string) => {
  try {
    const result = await axios.put(`${base_uri.base_uri}/message/${id}`);
  } catch (error) {
    console.log("Internal server error");
  }
};

export const getAllMessage = async (room: string) => {
  try {
    const result = await axios.get(
      `${base_uri.base_uri}/${URL.message}/${room}`
    );
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};
