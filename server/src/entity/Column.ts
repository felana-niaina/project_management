import mongoose, { Schema } from "mongoose";
import { TColumn } from "../types/column";

const columnSchema: Schema = new Schema({
  name: {
    type: String,
    require: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      require: false,
    },
  ],
});

export const Column = mongoose.model<TColumn>("Column", columnSchema);
