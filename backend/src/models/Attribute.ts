import { Schema, model, Document } from 'mongoose';

export interface IAttribute extends Document {
  key: string;         // 'strength', 'agility', etc.
  label: string;       // 'FOR', 'AGI'
  name: string;        // 'Força', 'Agilidade'
  iconName: string;    // 'Sword', 'Wind'
  colorVar: string;    // '--color-strength'
  description: string; // 'Poder físico e impacto'
  details: string;     // 'Afeta dano corpo a corpo...'
  modLabel: string;    // 'Dano Físico'
  modDiv: number;      // 3, 4, 0.5
}

const attributeSchema = new Schema<IAttribute>({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  name: { type: String, required: true },
  iconName: { type: String, required: true }, // Referência para o Lucide
  colorVar: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  modLabel: { type: String, required: true },
  modDiv: { type: Number, required: true, default: 1 }
});

export const Attribute = model<IAttribute>("Attribute", attributeSchema);