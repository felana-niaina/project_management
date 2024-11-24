import configUrl from "../utils";
import { TFormulaire } from "../types/Formulaire";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UserStore from "../store/UserStore";

export const getAllUser: any = async () => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/teams`);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error");
  }
};
export const getRoles = async () => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/roles`);
    console.log("result roles :::", result);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error", error);
  }
};
export const getUsersByRole = async (role: any) => {
  console.log("role::::", role);
  try {
    const result = await axios.get(`${configUrl.base_uri}/roles/${role}`);
    console.log("result userByRole ::", result);
    return result.data.result;
  } catch (error: any) {
    console.log("Internal server error", error);
  }
};
export const getUsersByProjectId = async (idProject: any) => {
  console.log("idProject::", idProject);
  try {
    const result = await axios.get(`${configUrl.base_uri}/teams/${idProject}`);
    console.log("result front ::", result);
    return result;
   
  } catch (error: any) {
    console.log("Internal server error", error);
  }
};

export const getOneById = async (id: string) => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/user/getOne/${id}`);
    return result.data;
  } catch (error) {
    console.log("Internal server error");
  }
};
export const updateUser = async (data: TFormulaire, id?: string) => {
  try {
    let URL = "/teams";
    if (id) {
      URL = URL + id;
    }
    const result = await axios.patch(`${configUrl.base_uri}${URL}`, data);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const createUser = async (data: TFormulaire) => {
  try {
    const result = await axios.post(`${configUrl.base_uri}/user`, data);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const result = await axios.put(`${configUrl.base_uri}/teams/${id}`);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const getMe = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    const { id } = jwtDecode(token) as any;
    const UserId = await getOneById(id);
    await UserStore.setState({ user: UserId.user });
  }
};

export const registerUser = async (data: TFormulaire) => {
  try {
    const result = await axios.post(
      `${configUrl.base_uri}/teams/registerUser`,
      data
    );
    console.log("result", result);
    return result;
  } catch (error: any) {
    console.log("Internal server error", error);
  }
};

export const getUserTaskCount = async (userId :any) => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/teams/taskByUser/${userId}`);
    console.log("Résultat côté frontend", result);
    return result.data.result; // Renvoie le nombre de tâches pour l'utilisateur spécifié
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre de tâches de l'utilisateur :", error);
    throw error; // Vous pouvez gérer l'erreur selon vos besoins
  }
};


