import mongoose, { Schema } from "mongoose";
import { TRole } from "../types/role";
const roleSchema: Schema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

export const Role = mongoose.model<TRole>("Role", roleSchema);
