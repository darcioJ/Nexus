import { Schema } from "mongoose";

export interface IItem {
  name: string;
  category: string;
  description?: string;
  quantity: number;
}

// Transformamos em um Schema reutilizável
export const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    uppercase: true,
    default: "OBJETO",
  },
  description: {
    type: String,
    required: false,
    default: "SEM_DESCRIÇÃO",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
});
