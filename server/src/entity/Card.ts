import mongoose, { Schema } from "mongoose";
import { TCard } from "../types/card";

const cardSchema: Schema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  attachment: {
    type: String,
    require: true,
  },
  assignee: {
    type: String,
    require: false,
  },
  dueDate: {
    type: String,
    require: true,
  },
  progress: {
    type: String,
    require: true,
  },
});

export const Card = mongoose.model<TCard>("Card", cardSchema);
