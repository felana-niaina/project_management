import configUrl from "../utils";
import { TFormulaire } from "../types/Formulaire";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import UserStore from "../store/UserStore";

export const getAllUser = async () => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/formulaire`);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error");
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
    let URL = "/formulaire";
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
    const result = await axios.put(`${configUrl.base_uri}/formulaire/${id}`);
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
      `${configUrl.base_uri}/formulaire/registerUser`,
      data
    );
    return result;
  } catch (error: any) {
    console.log("Internal server error", error);
  }
};
