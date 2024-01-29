import axios from "axios";
import configUrl from "../utils";
import { jwtDecode } from "jwt-decode";
import UserStore from "../store/UserStore";

export const loginAuth = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const logged = await axios.post(`${configUrl.base_uri}/auth`, data);
    if (logged.data) {
      localStorage.setItem("token", logged.data.token);
      UserStore.setState({ user: logged.data.user });
    }
    return logged.data;
  } catch (error) {
    console.log("Error in login :", error);
  }
};

export const loggOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("Project_name");
  localStorage.removeItem("Project_id");
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const { exp } = jwtDecode(token);
    console.log("exp :", exp);
    if (exp && exp * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
};
