import mongoose from 'mongoose';
import { Archetype } from '../models/Archetype.js'; // Verifique se o caminho está correto
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURAÇÃO DE AMBIENTE ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ARCHETYPES_TO_SEED = [
  {
    key: 'technognostic',
    name: 'Tecnognóstico',
    items: 'Scanner de Retina • Terminal Portátil • Chave Criptográfica',
    iconName: 'Binary',
    description: 'Possui conexão direta com a Nexuspédia. É um radar vivo: identifica fraquezas, resistências e o status atual de qualquer ameaça em tempo real.'
  },
  {
    key: 'nexus_voice',
    name: 'Voz do Nexus',
    items: 'Comunicador de Longo Alcance • Criptografador de Sinal • Sinalizador de Fótons',
    iconName: 'Radio',
    description: 'Elo direto com o Mestre do Nexus. Capaz de coordenar táticas a distâncias extremas e solicitar suporte ou informações privilegiadas durante a missão.'
  },
  {
    key: 'lab_synthesizer',
    name: 'Sintetizador de Lab',
    items: 'Cinturão de 9 Frascos • Misturador de Reagentes • Luvas Isolantes',
    iconName: 'FlaskConical',
    description: 'Carrega um arsenal de 9 essências puras. Pode arremessar ou ingerir frascos para aplicar efeitos de status imediatos no campo de batalha.'
  },
  {
    key: 'rebel_vanguard',
    name: 'Vanguarda Rebelde',
    items: 'Pé-de-Cabra de Titânio • Kit de Gazuas Magnéticas • Jaqueta Reforçada',
    iconName: 'Bomb',
    description: 'Especialista em arrombamento e saque. Sua presença física é intimidadora, atuando como o "Tanque" do grupo, capaz de absorver danos e forçar entradas.'
  },
  {
    key: 'trauma_unit',
    name: 'Unidade de Trauma',
    items: 'Selante Hemostático • Injetor de Adrenalina • Desfibrilador de Pulso',
    iconName: 'HeartPulse',
    description: 'O único capaz de estancar sangramentos críticos. Sua especialidade é manter o grupo vivo, sendo o único protocolo habilitado para reanimar aliados caídos.'
  },
  {
    key: 'continuum_historian',
    name: 'Historiador do Continuum',
    items: 'Codex de Sincronia • Scanner de Fendas • Estabilizador Quântico',
    iconName: 'Timer',
    description: 'Autoridade em arqueologia digital. Decifra a lógica ancestral do Nexus e a origem de anomalias, manipulando dados históricos para resolver eventos críticos em tempo real.'
  }
];

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ DATABASE_URL não encontrada no .env");
    process.exit(1);
  }

  try {
    console.log("📡 Conectando ao Vault para sincronizar Arquétipos...");
    await mongoose.connect(uri);

    // Limpeza para evitar duplicatas
    await Archetype.deleteMany({});
    console.log("🧹 Arquétipos antigos deletados.");

    // Injeção dos novos dados
    await Archetype.insertMany(ARCHETYPES_TO_SEED);
    console.log("💎 Vault_Update: Arquétipos (Kits) imortalizados com sucesso.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha crítica no Seeding de Arquétipos:", error);
    process.exit(1);
  }
}

seedDatabase();