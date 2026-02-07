import { Schema, model, Document } from "mongoose";

export interface IStatusEffect extends Document {
  key: string; // 'queimado', 'sangrando'
  name: string; // 'Queimado'
  description?: string;
  mechanic: string; // O que ele faz (ex: -2 Vida/turno)
  resistance: string; // Como resistir (ex: VIT)
  category: "Elemental" | "Corruptora" | "Espiritual" | "Universal"; // 'Elemental'
  iconName: string; // 'Flame', 'Zap'
  colorVar: string; // '--color-fogo'
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusEffectSchema = new Schema<IStatusEffect>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    mechanic: { type: String, required: true },
    resistance: { type: String, required: true },
    category: {
      type: String,
      enum: ["Elemental", "Corruptora", "Espiritual", "Universal"],
      required: true,
    },
    iconName: { type: String, required: true },
    colorVar: { type: String, required: true },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const StatusEffect = model<IStatusEffect>(
  "StatusEffect",
  statusEffectSchema,
);
