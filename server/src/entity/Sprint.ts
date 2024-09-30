import mongoose, { Schema } from "mongoose";
import { TSprint } from "../types/sprint";
const sprintSchema: Schema = new Schema({
  id: {
    type: String,
    require: true,
  },
  idProject: [
    {
      type: mongoose.Types.ObjectId,
      require: false,
      ref: "Project",
    },
  ],
  
  name: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    require: true,
  },
  endDate: {
    type: String,
    require: true,
  },
  column: [
    {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Column",
    },
  ],
  status: {
    type: String,
    require: true,
    enum: ["next", "in-progress", "completed"],
    default: "next", // Sprint commence comme "next"
  },
  
});

export const Sprint = mongoose.model<TSprint>("Sprint", sprintSchema);

