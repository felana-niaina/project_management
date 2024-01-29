import mongoose, { Schema } from "mongoose";
import { TNotification } from "../types/notification";

const notificationSchema: Schema = new Schema(
  {
    message: {
      type: String,
      require: true,
    },
    nameProject: {
      type: String,
      require: true,
    },
    idProject: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<TNotification>(
  "Notification",
  notificationSchema
);
