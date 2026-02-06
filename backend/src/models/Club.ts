import { Schema, model, Document } from 'mongoose';

export interface IClub extends Document {
  key: string;            // 'musculacao', 'robotica'
  name: string;           // 'Musculação'
  iconName: string;       // 'Dumbbell'
  description: string;    // 'O treino pesado na academia...'
  bonus: {
    attributeKey: string; // 'strength', 'intelligence' (Link com a key do Atributo)
    value: number;        // 1
  };
}

const clubSchema = new Schema<IClub>({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  iconName: { type: String, required: true },
  description: { type: String, required: true },
  bonus: {
    attributeKey: { type: String, required: true },
    value: { type: Number, required: true, default: 1 }
  }
});

export const Club = model<IClub>("Club", clubSchema);