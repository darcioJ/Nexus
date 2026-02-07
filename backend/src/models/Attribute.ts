import { Schema, model, Document } from "mongoose";

export interface IAttribute extends Document {
  key: string; // 'strength', 'agility', etc.
  name: string; // 'Força', 'Agilidade'
  description?: string; // 'Poder físico e impacto'
  iconName: string; // 'Sword', 'Wind'
  colorVar: string; // '--color-strength'
  modLabel: string; // 'Dano Físico'
  modDiv: number; // 3, 4, 0.5
  createdAt: Date;
  updatedAt: Date;
}

const attributeSchema = new Schema<IAttribute>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    iconName: { type: String, required: true }, // Referência para o Lucide
    colorVar: { type: String, required: true },
    modLabel: { type: String, required: true },
    modDiv: { type: Number, required: true, default: 1 },
  },
  { timestamps: true },
);

export const Attribute = model<IAttribute>("Attribute", attributeSchema);
