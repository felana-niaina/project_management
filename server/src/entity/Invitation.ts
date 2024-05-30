import mongoose, { Schema } from "mongoose";
import { TInvitation } from "../types/invitation";

const invitationSchema: Schema = new Schema(
  {
    mail: {
      type: String,
      require: true,
    },
    idProject: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    isCreated: {
      type: Boolean,
      default: false,
      require: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Invitation = mongoose.model<TInvitation>(
  "Invitation",
  invitationSchema
);
