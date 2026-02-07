import { Schema, model, Document } from "mongoose";

export interface IClub extends Document {
  key: string; // 'musculacao', 'robotica'
  name: string; // 'Musculação'
  iconName: string; // 'Dumbbell'
  description?: string; // 'O treino pesado na academia...'
  bonus: {
    attributeId: Types.ObjectId;
    value: number; // 1
  };
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clubSchema = new Schema<IClub>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    iconName: { type: String, required: true },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    bonus: {
      attributeId: {
        type: Schema.Types.ObjectId,
        ref: "Attribute", // Certifique-se de que o model de Atributo se chama "Attribute"
        required: true,
      },
      value: { type: Number, required: true, default: 1 },
    },
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Club = model<IClub>("Club", clubSchema);
