import mongoose, { Schema } from "mongoose";
import { TBacklog } from "../types/backlog";
const backlogSchema: Schema = new Schema({
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
  epic: {
    type: String,
    require: true,
  },
  userStory: {
    type: String,
    require: true,
  },
  task: {
    type: String,
    require: true,
  },
  priority: {
    type: String,
    require: true,
  },
  cout: {
    type: String,
    require: true,
  },
  sprint: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    require: true,
  },
  
});

export const Backlog = mongoose.model<TBacklog>("Backlog", backlogSchema);

