import mongoose, { Schema } from "mongoose";
import { TUser } from "../types/user";

const userSchema: Schema = new Schema({
  idProject: [
    {
      type: mongoose.Types.ObjectId,
      require: false,
      ref: "Project",
    },
  ],
  username: {
    type: String,
    require: true,
  },
  firstname: {
    type: String,
    require: true,
  },
  lastname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: false,
  },
  role: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "Role",
  },
  isConnected: {
    type: Boolean,
    require: false,
  },
  isWriting: {
    type: Boolean,
    require: false,
  },
});

export const User = mongoose.model<TUser>("User", userSchema);
