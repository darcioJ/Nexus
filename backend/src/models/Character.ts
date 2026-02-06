import { Schema, model } from "mongoose";

const characterSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

  identity: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
  },

  background: {
    origin: { type: Schema.Types.ObjectId, ref: "Club", required: true },
    biography: { type: String },
    starterKit: { type: String, required: true },
  },

  attributes: {
    type: Map,
    of: Number,
    default: {},
  },

  weapons: {
    primary: { type: Schema.Types.ObjectId, ref: "Weapon", required: true },
  },

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
      default: "6983b9a594b223b8c7d9f51c", // Estabilizado
    },
  },

  version: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// --- MIDDLEWARE NEXUS: SINCRONIA DE ATRIBUTOS (ASYNC VERSION) ---
characterSchema.pre("save", async function () {
  const char = this;
  
  // 1. EXTRAÇÃO DE ATRIBUTOS
  const attributes = char.attributes;
  if (!attributes) return;

  const values = attributes instanceof Map
      ? Array.from(attributes.values())
      : Object.values(attributes);

  const totalNX = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);

  // 2. VALIDAÇÃO DE OVERLOAD
  if (totalNX > 43) throw new Error(`[NEXUS_OVERLOAD]: Soma ${totalNX} excede o limite.`);
  if (totalNX < 30) throw new Error(`[NEXUS_LOW_SIGNAL]: Soma ${totalNX} insuficiente.`);

  // 3. CÁLCULO DE INTEGRIDADE (Stats Sub-document)
  const vit = Number(char.get("attributes.vitality")) || 0;
  const int = Number(char.get("attributes.intelligence")) || 0;
  const ess = Number(char.get("attributes.essence")) || 0;

  // Atualiza as propriedades dentro do objeto stats
  char.stats.maxHp = 90 + vit * 2;
  char.stats.maxSan = 30 + (int + ess);

  // Inicializa valores atuais se for um novo sinal
  if (char.isNew) {
    char.stats.hp = char.stats.maxHp;
    char.stats.san = char.stats.maxSan;
  }
});

export const Character = model("Character", characterSchema);
