import { Schema, model, Document } from 'mongoose';

export interface IWeapon extends Document {
  key: string;            // 'icarus_bow', 'nyx_scythe'
  name: string;           // 'Arco de Ícarus'
  typeLabel: string;      // 'Zênite Abençoado'
  essenceId: Schema.Types.ObjectId; // Link com Essence
  range: 'Curto' | 'Médio' | 'Longo';
  description: string;    // O "effect" do seu dado original
  specialNotes: string;   // O "obs" do seu dado original
}

const weaponSchema = new Schema<IWeapon>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  typeLabel: { type: String, required: true },
  essenceId: { type: Schema.Types.ObjectId, ref: 'Essence', required: true },
  range: { type: String, enum: ['Curto', 'Médio', 'Longo'], required: true },
  description: { type: String, required: true },
  specialNotes: { type: String, required: true }
});

export const Weapon = model<IWeapon>("Weapon", weaponSchema);