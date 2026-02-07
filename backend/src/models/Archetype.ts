import { Schema, model, Document } from "mongoose";

export interface IArchetype extends Document {
  key: string; // 'technognostic', 'trauma_unit'
  name: string; // 'Tecnognóstico', 'Unidade de Trauma'
  description?: string; // O texto de "lore" do kit
  items: string; // A lista de equipamentos inicial
  iconName: string; // 'Binary', 'HeartPulse', etc.
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
    items: { type: String, required: true },
    iconName: { type: String, required: true },
  },
  { timestamps: true },
);

export const Archetype = model<IArchetype>("Archetype", archetypeSchema);
