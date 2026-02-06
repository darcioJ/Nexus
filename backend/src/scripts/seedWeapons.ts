import mongoose from 'mongoose';
import { Weapon } from '../models/Weapon.js';
import { Essence } from '../models/Essence.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;

  if (!uri) {
    console.error("❌ DATABASE_URL não encontrada no .env");
    process.exit(1);
  }

  try {
    console.log("📡 Conectando ao Vault para forjar o Arsenal...");
    await mongoose.connect(uri);

    // 1. MAPEAMENTO DE ESSÊNCIAS
    // Buscamos as essências já existentes para vincular os ObjectIDs
    const essences = await Essence.find({});
    
    const getEssenceId = (name: string) => {
      const found = essences.find(e => e.name === name);
      if (!found) {
        console.warn(`⚠️ Aviso: Essência "${name}" não encontrada no Vault.`);
        return null;
      }
      return found._id;
    };

    const WEAPONS_TO_SEED = [
      {
        key: 'icarus_bow',
        name: 'Arco de Ícarus',
        typeLabel: 'Zênite Abençoado',
        essenceId: getEssenceId('Benção'),
        range: 'Longo',
        description: 'Purificação e dano extra contra mortos-vivos',
        specialNotes: 'DISPARO: 3 flechas douradas simultâneas. SINERGIA: Precisão aumenta drasticamente com PER alta.'
      },
      {
        key: 'raziel_wings',
        name: 'Asas de Raziel',
        typeLabel: 'Efígie Onírica',
        essenceId: getEssenceId('Lúmen'),
        range: 'Curto',
        description: 'Distorção psíquica e controle mental breve',
        specialNotes: 'MOBILIDADE: Permite voo e esquiva. SINERGIA: A chance de desvio escala diretamente com sua AGI.'
      },
      {
        key: 'persephone_staff',
        name: 'Cajado de Perséfone',
        typeLabel: 'Hierofante Vital',
        essenceId: getEssenceId('Vital'),
        range: 'Médio',
        description: 'Cura aliados e envenena inimigos humanoides',
        specialNotes: 'CONTROLE: Barreira de raízes por 5s. SINERGIA: Escala cura com INT e dano de veneno com ESS.'
      },
      {
        key: 'nyx_scythe',
        name: 'Foice de Nyx',
        typeLabel: 'Algoz Umbral',
        essenceId: getEssenceId('Sombra'),
        range: 'Curto',
        description: 'Drena energia vital e invoca espectros',
        specialNotes: 'TREVAS: Risco de corrupção permanente. SINERGIA: O dano aumenta para cada ponto de ESS gasto.'
      },
      {
        key: 'hades_hooks',
        name: 'Ganchos de Hades',
        typeLabel: 'Atrelado Infernal',
        essenceId: getEssenceId('Fogo'),
        range: 'Longo',
        description: 'Puxa o alvo com correntes de metal incandescente e causa queimaduras prolongadas',
        specialNotes: 'CONTROLE: Puxa o inimigo para o alcance curto. SINERGIA: Alvos puxados recebem 50% de dano extra de Piroclasta.'
      },
      {
        key: 'zeus_lance',
        name: 'Lança de Zeus',
        typeLabel: 'Arauto Galvânico',
        essenceId: getEssenceId('Raio'),
        range: 'Longo',
        description: 'Dano em área e manipulação climática',
        specialNotes: 'ÁREA: Chamado de raios. SINERGIA: Se houver chuva no ambiente, o dano ignora a armadura do alvo.'
      },
      {
        key: 'boreas_fang',
        name: 'Presa de Boreas',
        typeLabel: 'Glacial Perfurante',
        essenceId: getEssenceId('Gelo'),
        range: 'Curto',
        description: 'Reduz a velocidade molecular e causa fragilidade física no núcleo do alvo.',
        specialNotes: 'ÊXTASE: Congela o solo em um raio de 3m ao impactar. SINERGIA: Inimigos sob efeito de FRIO têm 30% de chance de sofrer quebra de armadura ao receber dano de FOR.'
      },
      {
        key: 'gehenna_revolver',
        name: 'Revólver de Gehenna',
        typeLabel: 'Nômade Anômalo',
        essenceId: getEssenceId('Caos'),
        range: 'Médio',
        description: '50% de chance de causar dano letal',
        specialNotes: 'SORTE: Eficaz apenas contra seres malignos. SINERGIA: Consumir 1 ESS garante 100% de acerto.'
      },
      {
        key: 'jormungand_bolt',
        name: 'Virote de Jormungand',
        typeLabel: 'Viperina Ácida',
        essenceId: getEssenceId('Veneno'),
        range: 'Médio',
        description: 'Corrói armaduras biológicas e impede qualquer forma de regeneração celular.',
        specialNotes: 'TOXINA: Disparo deixa um rastro de gás ácido persistente. SINERGIA: O dano corrosivo aumenta progressivamente conforme a Vitalidade (VIT) do alvo diminui.'
      }
    ];

    // 2. INJEÇÃO
    await Weapon.deleteMany({});
    console.log("🧹 Arsenal antigo removido.");

    await Weapon.insertMany(WEAPONS_TO_SEED);
    console.log("💎 Vault_Arsenal: Todas as armas foram imortalizadas e vinculadas às Essências.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha crítica no Seeding de Armas:", error);
    process.exit(1);
  }
}

seedDatabase();