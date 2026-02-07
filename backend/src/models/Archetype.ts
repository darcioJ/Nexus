import { Schema, model, Document } from "mongoose";
import { ItemSchema, type IItem } from "./common/ItemSchema.js";

export interface IArchetype extends Document {
  key: string; // 'technognostic', 'trauma_unit'
  name: string; // 'Tecnognóstico', 'Unidade de Trauma'
  description?: string; // O texto de "lore" do kit
  items: IItem[]; // A lista de equipamentos inicial
  iconName: string; // 'Binary', 'HeartPulse', etc.
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const archetypeSchema = new Schema<IArchetype>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    items: [ItemSchema],
    iconName: { type: String, required: true },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Archetype = model<IArchetype>("Archetype", archetypeSchema);
