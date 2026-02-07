import { Schema, model } from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  role: "MASTER" | "PLAYER";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ["MASTER", "PLAYER"], default: "PLAYER" }
}, { timestamps: true } );

export const User = model<IUser>("User", userSchema);