import { Schema, model, Document } from "mongoose";

export interface IEssence extends Document {
  key: string; // 'fire', 'ice'
  name: string; // 'Fogo'
  category: "Elemental" | "Corruptora" | "Espiritual" | "Universal"; // 'Elemental'
  description?: string;
  advantageAgainst: string; // O seu antigo 'vs'
  iconName: string; // 'Flame', 'Zap'
  colorVar: string; // '--color-fogo'
  statusId: Schema.Types.ObjectId; // Link para o StatusEffect
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const essenceSchema = new Schema<IEssence>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["Elemental", "Corruptora", "Espiritual", "Universal"],
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    advantageAgainst: { type: String, required: true },
    iconName: { type: String, required: true },
    colorVar: { type: String, required: true },
    statusId: {
      type: Schema.Types.ObjectId,
      ref: "StatusEffect",
      required: true,
    },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Essence = model<IEssence>("Essence", essenceSchema);
