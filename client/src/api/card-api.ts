import configUrl from "../utils";
import { TCard } from "../types/Card";
import axios from "axios";

export const getAllCard = async () => {
  try {
    const result = await axios.get(`${configUrl.base_uri}/card`);
    return result.data;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const createCard = async (data: TCard, idColumn: string) => {
  try {
    const result = await axios.post(`${configUrl.base_uri}/card`, {
      data,
      idColumn,
    });
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const updateCard = async (data: TCard, id: string) => {
  console.log("dataUpdate", data);
  try {
    const result = await axios.patch(`${configUrl.base_uri}/card`, {
      data,
      id,
    });
    console.log("resultUpdate", result);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};

export const moveCard = async (
  cardId: string,
  sourceColumnId: string,
  targetColumnId: string
) => {
  try {
    const result = await axios.post(`${configUrl.base_uri}/card/move`, {
      cardId,
      sourceColumnId,
      targetColumnId,
    });
    return result;
  } catch (error: any) {
    console.log('Internal server error');
  }
};


export const deleteCard = async (id: string) => {
  try {
    const result = await axios.put(`${configUrl.base_uri}/card/${id}`);
    return result;
  } catch (error: any) {
    console.log("Internal server error");
  }
};
