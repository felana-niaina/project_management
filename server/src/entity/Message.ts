import mongoose, { Schema } from "mongoose";
import { TMessage } from "../types/message";

const messageSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model<TMessage>("Message", messageSchema);
