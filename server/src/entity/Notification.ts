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
    project: {
      type: mongoose.Types.ObjectId,
      require: true,
    },
    read: {
      type: Boolean,
      default: false,
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
