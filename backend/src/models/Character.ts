import { Schema, model } from "mongoose";
import { syncCharacterStats } from "../middleware/characterMiddleware.js";
import { ItemSchema, type IItem } from "./common/ItemSchema.js";

export interface ICharacter {
  userId?: Schema.Types.ObjectId;
  identity: {
    name: string;
    age: number;
  };
  background: {
    club: Schema.Types.ObjectId;
    biography?: string;
    archetype: Schema.Types.ObjectId;
  };
  attributes: Map<string, number>;
  weapons: {
    primary: Schema.Types.ObjectId;
  };
  inventory: IItem[];
  stats: {
    hp: number;
    maxHp: number;
    san: number;
    maxSan: number;
    status: Schema.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
}

const characterSchema = new Schema<ICharacter>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

    identity: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
    },

    background: {
      club: { type: Schema.Types.ObjectId, ref: "Club", required: true },
      biography: {
        type: String,
        required: false,
        default: "-SEM_REGISTRO_DE_BIO-",
      },
      archetype: {
        type: Schema.Types.ObjectId,
        ref: "Archetype",
        required: true,
      },
    },

    // No seu characterSchema (Backend)
    attributes: {
      type: Map,
      of: Number,
      default: {},
      validate: {
        validator: function (v: Map<string, number>) {
          // Garante que nenhuma chave seja o erro de stringificação do JS
          return !Array.from(v.keys()).some(
            (key) => key.includes("[object") || key === "null",
          );
        },
        message: "Matriz de atributos contém chaves de sincronia inválidas.",
      },
    },

    weapons: {
      primary: { type: Schema.Types.ObjectId, ref: "Weapon", required: true },
    },

    inventory: [ItemSchema],

    // --- O NOVO NÚCLEO DE BIO-TELEMETRIA ---
    stats: {
      hp: { type: Number, default: 100 },
      maxHp: { type: Number, default: 100 },
      san: { type: Number, default: 100 },
      maxSan: { type: Number, default: 100 },
      status: {
        type: Schema.Types.ObjectId,
        ref: "StatusEffect",
        required: true,
      },
    },
  },
  { timestamps: true },
);

characterSchema.pre("validate", syncCharacterStats);

export const Character = model<ICharacter>("Character", characterSchema);
