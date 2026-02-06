import mongoose from "mongoose";
import { Attribute } from "../models/Attribute.js"; // Note o .js se estiver usando ESM
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- CONFIGURAÇÃO DE CAMINHO ABSOLUTO ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Isso força o dotenv a buscar o arquivo na raiz do /backend,
// subindo dois níveis a partir de /src/scripts
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const ATTRIBUTES_TO_SEED = [
  {
    key: "strength",
    label: "FOR",
    name: "Força",
    iconName: "Sword",
    colorVar: "var(--color-strength)",
    description: "Poder físico e impacto",
    details: "Afeta dano corpo a corpo e capacidade de quebrar defesas.",
    modLabel: "Dano Físico",
    modDiv: 3,
  },
  {
    key: "agility",
    label: "AGI",
    name: "Agilidade",
    iconName: "Wind",
    colorVar: "var(--color-agility)",
    description: "Velocidade e reflexo",
    details: "Afeta esquiva, iniciativa e precisão à distância.",
    modLabel: "Esquiva",
    modDiv: 4,
  },
  {
    key: "vitality",
    label: "VIT",
    name: "Vitalidade",
    iconName: "Shield",
    colorVar: "var(--color-vitality)",
    description: "Saúde e resistência",
    details: "Mede seu HP total e resistência a venenos/queimaduras.",
    modLabel: "HP Máximo",
    modDiv: 0.5,
  },
  {
    key: "intelligence",
    label: "INT",
    name: "Inteligência",
    iconName: "BookOpen",
    colorVar: "var(--color-intelligence)",
    description: "Energia dimensional",
    details: "Manipula essências e resiste a efeitos mentais/corrupção.",
    modLabel: "Poder Mágico",
    modDiv: 3,
  },
  {
    key: "perception",
    label: "PER",
    name: "Percepção",
    iconName: "Eye",
    colorVar: "var(--color-perception)",
    description: "Atenção e mira",
    details: "Chance de acerto crítico e detecção de emboscadas.",
    modLabel: "Crítico",
    modDiv: 4,
  },
  {
    key: "essence",
    label: "ESS",
    name: "Essência",
    iconName: "Aperture",
    colorVar: "var(--color-essence)",
    description: "Sincronia da alma",
    details: "Aumenta a duração de efeitos e afinidade com armas vivas.",
    modLabel: "Duração",
    modDiv: 3,
  },
];

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error(
      "❌ ERRO: DATABASE_URL não encontrada. O script não conseguiu ler o seu .env",
    );
    console.log("Caminho tentado:", path.resolve(__dirname, "../../.env"));
    process.exit(1);
  }

  try {
    console.log("📡 Conectando ao Vault...");
    await mongoose.connect(uri);

    // 2. Limpeza de Segurança (Evita duplicar atributos se rodar o script 2x)
    await Attribute.deleteMany({});
    console.log("🧹 Atributos antigos eliminados.");

    // 3. Injeção em Massa
    await Attribute.insertMany(ATTRIBUTES_TO_SEED);
    console.log(
      "💎 Sincronia concluída: Todos os atributos foram imortalizados no DB.",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha crítica no Seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
