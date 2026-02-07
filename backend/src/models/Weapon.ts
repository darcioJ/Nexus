import { Schema, model, Document } from "mongoose";

interface ISpecialNote {
  category: string; // 'SORTE', 'SINERGIA', 'REQUISITO'
  content: string; // 'Eficaz apenas contra seres malignos.'
}

export interface IWeapon extends Document {
  key: string; // 'icarus_bow', 'nyx_scythe'
  name: string; // 'Arco de Ícarus'
  typeLabel: string; // 'Zênite Abençoado'
  essenceId: Schema.Types.ObjectId; // Link com Essence
  range: "Curto" | "Médio" | "Longo";
  description?: string; // O "effect" do seu dado original
  specialNotes: ISpecialNote[];
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const weaponSchema = new Schema<IWeapon>(
  {
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    typeLabel: { type: String, required: true },
    essenceId: { type: Schema.Types.ObjectId, ref: "Essence", required: true },
    range: { type: String, enum: ["Curto", "Médio", "Longo"], required: true },
    description: {
      type: String,
      required: false,
      default: "-DADOS_EXPURGADOS-",
    },
    specialNotes: [
      {
        category: { type: String, required: true, uppercase: true },
        content: { type: String, required: true },
      },
    ],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Weapon = model<IWeapon>("Weapon", weaponSchema);
