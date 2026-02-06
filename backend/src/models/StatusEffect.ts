import { Schema, model, Document } from 'mongoose';

export interface IStatusEffect extends Document {
  key: string;          // 'queimado', 'sangrando'
  name: string;         // 'Queimado'
  description: string;
  mechanic: string;     // O que ele faz (ex: -2 Vida/turno)
  resistance: string;   // Como resistir (ex: VIT)
  type: 'ELEMENTAL' | 'CORRUPTORA' | 'ESPIRITUAL' | 'UNIVERSAL';
}

const statusEffectSchema = new Schema<IStatusEffect>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  mechanic: { type: String, required: true },
  resistance: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ELEMENTAL', 'CORRUPTORA', 'ESPIRITUAL', 'UNIVERSAL'],
    required: true 
  }
});

export const StatusEffect = model<IStatusEffect>("StatusEffect", statusEffectSchema);