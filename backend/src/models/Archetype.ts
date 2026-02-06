import { Schema, model, Document } from 'mongoose';

export interface IArchetype extends Document {
  key: string;         // 'technognostic', 'trauma_unit'
  name: string;        // 'Tecnognóstico', 'Unidade de Trauma'
  description: string; // O texto de "lore" do kit
  items: string;       // A lista de equipamentos inicial
  iconName: string;    // 'Binary', 'HeartPulse', etc.
}

const archetypeSchema = new Schema<IArchetype>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  items: { type: String, required: true },
  iconName: { type: String, required: true }
});

export const Archetype = model<IArchetype>("Archetype", archetypeSchema);