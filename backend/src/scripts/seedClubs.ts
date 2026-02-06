import mongoose from 'mongoose';
import { Club } from '../models/Club.js'; // Verifique se o caminho e a extensão .js estão corretos
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURAÇÃO DE AMBIENTE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const CLUBS_TO_SEED = [
  {
    key: 'fitness',
    name: 'Musculação',
    iconName: 'Dumbbell',
    description: 'O treino pesado na academia da escola preparou seus músculos para o peso das armas.',
    bonus: { attributeKey: 'strength', value: 1 }
  },
  {
    key: 'swimming',
    name: 'Natação',
    iconName: 'Waves',
    description: 'Anos controlando o fôlego e a resistência nas piscinas garantiram sua sobrevivência.',
    bonus: { attributeKey: 'vitality', value: 1 }
  },
  {
    key: 'skate',
    name: 'Skate',
    iconName: 'Wind',
    description: 'Dominar as ruas e os reflexos rápidos tornaram você um alvo difícil de atingir.',
    bonus: { attributeKey: 'agility', value: 1 }
  },
  {
    key: 'robotics',
    name: 'Robótica',
    iconName: 'Cpu',
    description: 'Sua facilidade em montar circuitos ajuda a entender a tecnologia complexa do Nexus.',
    bonus: { attributeKey: 'intelligence', value: 1 }
  },
  {
    key: 'photography',
    name: 'Fotografia',
    iconName: 'Camera',
    description: 'Seu olhar treinado para capturar detalhes percebe perigos que outros ignoram.',
    bonus: { attributeKey: 'perception', value: 1 }
  },
  {
    key: 'arts',
    name: 'Artes Visuais',
    iconName: 'Palette',
    description: 'Sua sensibilidade artística permite uma conexão natural com as energias dimensionais.',
    bonus: { attributeKey: 'essence', value: 1 }
  }
];

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ DATABASE_URL não encontrada no .env");
    process.exit(1);
  }

  try {
    console.log("📡 Conectando ao Vault para sincronizar Clubes...");
    await mongoose.connect(uri);

    // Limpa para evitar duplicatas
    await Club.deleteMany({});
    console.log("🧹 Tabela de Clubes resetada.");

    // Injeta os novos dados
    await Club.insertMany(CLUBS_TO_SEED);
    console.log("💎 Vault_Update: Clubes imortalizados com sucesso.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha crítica no Seeding de Clubes:", error);
    process.exit(1);
  }
}

seedDatabase();