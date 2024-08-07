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
  // backlog: [
  //   {
  //     type: String,
  //     require: true,
  //   },
  // ],
  // priority: {
  //   type: String,
  //   require: true,
  // },
  // estimate: {
  //   type: String,
  //   require: true,
  // },
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
  
});

export const Sprint = mongoose.model<TSprint>("Sprint", sprintSchema);

