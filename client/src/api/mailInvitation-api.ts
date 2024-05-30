import axios from "axios";
import { TInvitation } from "../types/MailInvitation";
import base_uri from "../utils";
const URL = {
  invitation: "invitation",
};

export const sendInvitation = async (data: TInvitation) => {
  try {
    const result = await axios.post(
      `${base_uri.base_uri}/${URL.invitation}`,
      data
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log("Internal server error");
  }
};

