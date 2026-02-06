import mongoose from 'mongoose';
import { Essence } from '../models/Essence.js'; 
import { StatusEffect } from '../models/StatusEffect.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("❌ DATABASE_URL não encontrada.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("📡 Conectado para sincronia de Essências...");

    // 1. MAPEAMENTO DE STATUS: Buscamos os status que já estão no banco
    const statuses = await StatusEffect.find({});
    
    // Função auxiliar para encontrar o ID pelo nome exato que está no DB
    const getStatusId = (name: string) => {
      const status = statuses.find(s => s.name === name);
      if (!status) {
        console.warn(`⚠️ Aviso: Status "${name}" não encontrado no Vault.`);
        return null;
      }
      return status._id;
    };

    // 2. DEFINIÇÃO DOS DADOS (Agora dentro da função para usar os IDs)
    const ESSENCES_TO_SEED = [
      {
        key: 'fire',
        name: 'Fogo',
        category: 'Elemental',
        description: 'Queima e consome a energia vital, transformando matéria em entropia pura.',
        advantageAgainst: 'Plantas, Insetos e criaturas de criogênese.',
        iconName: 'Flame',
        colorVar: 'var(--color-fogo)',
        baseStatusId: getStatusId('Queimado')
      },
      {
        key: 'ice',
        name: 'Gelo',
        category: 'Elemental',
        description: 'Congela o fluxo de energia, reduzindo a velocidade e a resistência.',
        advantageAgainst: 'Aquáticos, Demônios e criaturas piroclásticas.',
        iconName: 'Snowflake',
        colorVar: 'var(--color-gelo)',
        baseStatusId: getStatusId('Congelado')
      },
      {
        key: 'thunder',
        name: 'Raio',
        category: 'Elemental',
        description: 'Rompe defesas e causa paralisia sináptica.',
        advantageAgainst: 'Metálicos, Voadores e organismos condutores.',
        iconName: 'Zap',
        colorVar: 'var(--color-raio)',
        baseStatusId: getStatusId('Paralisado')
      },
      {
        key: 'poison',
        name: 'Veneno',
        category: 'Corruptora',
        description: 'Drena a integridade biológica e contamina o núcleo.',
        advantageAgainst: 'Organismos vivos e sistemas frágeis.',
        iconName: 'Skull',
        colorVar: 'var(--color-veneno)',
        baseStatusId: getStatusId('Envenenado')
      },
      {
        key: 'dark',
        name: 'Sombra',
        category: 'Corruptora',
        description: 'Absorve fótons e corrompe a luz.',
        advantageAgainst: 'Seres espirituais e purificados.',
        iconName: 'Moon',
        colorVar: 'var(--color-sombra)',
        baseStatusId: getStatusId('Assombrado')
      },
      {
        key: 'chaos',
        name: 'Caos',
        category: 'Corruptora',
        description: 'Desestabiliza o fluxo dimensional.',
        advantageAgainst: 'Seres de ordem e máquinas.',
        iconName: 'Dices',
        colorVar: 'var(--color-caos)',
        baseStatusId: getStatusId('Caótico')
      },
      {
        key: 'blessing',
        name: 'Benção',
        category: 'Espiritual',
        description: 'Canaliza energia pura para cura e proteção.',
        advantageAgainst: 'Mortos-vivos e entidades corrompidas.',
        iconName: 'Sun',
        colorVar: 'var(--color-bencao)',
        baseStatusId: getStatusId('Abençoado')
      },
      {
        key: 'vital',
        name: 'Vital',
        category: 'Espiritual',
        description: 'Amplifica a ressonância da vida.',
        advantageAgainst: 'Patógenos e degradação mental.',
        iconName: 'Leaf',
        colorVar: 'var(--color-vital)',
        baseStatusId: getStatusId('Revigorado')
      },
      {
        key: 'lumen',
        name: 'Lúmen',
        category: 'Espiritual',
        description: 'Emana luz síncrotron para desorientar.',
        advantageAgainst: 'Seres de alta cognição.',
        iconName: 'Eye',
        colorVar: 'var(--color-lumen)',
        baseStatusId: getStatusId('Desorientado')
      }
    ];

    // 3. EXECUÇÃO
    await Essence.deleteMany({});
    await Essence.insertMany(ESSENCES_TO_SEED);

    console.log("💎 Vault_Spectral: Essências imortalizadas e vinculadas.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no Seeding:", error);
    process.exit(1);
  }
}

seedDatabase();