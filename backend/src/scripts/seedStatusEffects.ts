import mongoose from "mongoose";
import { StatusEffect } from "../models/StatusEffect.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const STATUS_TO_SEED = [
  // --- ELEMENTAIS ---
  {
    key: "burned",
    name: "Queimado",
    description:
      "A integridade molecular está sendo consumida por chamas etéreas.",
    mechanic: "-2 Vida/turno e redução de regeneração natural.",
    resistance: "Vitalidade (VIT)",
    type: "ELEMENTAL",
  },
  {
    key: "frozen",
    name: "Congelado",
    description:
      "Estase térmica absoluta. Uma crosta de gelo dimensional retarda o fluxo de energia.",
    mechanic: "-2 AGI e Teste > 8 no d12 para ações físicas.",
    resistance: "Força (FOR) ou Calor Ambiental",
    type: "ELEMENTAL",
  },
  {
    key: "paralyzed",
    name: "Paralisado",
    description:
      "Sobrecarga sináptica galvânica. O sistema nervoso foi travado por energia instável.",
    mechanic: "Imóvel até AGI > 9. A cada turno: Teste AGI > 9.",
    resistance: "Vitalidade (VIT)",
    type: "ELEMENTAL",
  },
  // --- CORRUPTORAS ---
  {
    key: "poisoned",
    name: "Envenenado",
    description:
      "Toxinas anômalas infiltraram o núcleo, provocando falha sistêmica.",
    mechanic: "-3 Vida/turno e cura com metade da eficácia.",
    resistance: "Vitalidade (VIT) e Essência (ESS)",
    type: "CORRUPTORA",
  },
  {
    key: "haunted",
    name: "Assombrado",
    description:
      "Ancoragem umbral profunda. Entidades drenam a lucidez do portador.",
    mechanic: "-2 Sanidade/turno, falha ataque d20 < 12 e cura ineficaz.",
    resistance: "Inteligência (INT) e Essência (ESS)",
    type: "CORRUPTORA",
  },
  {
    key: "chaotic",
    name: "Caótico",
    description:
      "Ruptura na causalidade. O tecido da realidade ao redor do alvo está fragmentado.",
    mechanic: "Instabilidade de Alvo: Rolagem 1-6 aliado | 7-12 inimigo.",
    resistance: "Baixa Percepção (PER)",
    type: "CORRUPTORA",
  },
  // --- ESPIRITUAIS ---
  {
    key: "blessed",
    name: "Abençoado",
    description:
      "Corpo imbuído com frequência pura, blindado contra a entropia.",
    mechanic: "+1 ESS, +1 VIT e +2 bônus em teste de cura.",
    resistance: "3 Turnos ou Dissipação de Corrupção",
    type: "ESPIRITUAL",
  },
  {
    key: "refreshed",
    name: "Revigorado",
    description:
      "Fluxo livre de energia vital, otimizando a regeneração celular.",
    mechanic: "Recupera 1d6 Vida e +1 Sanidade/turno.",
    resistance: "Anulado por: Caos ou Veneno",
    type: "ESPIRITUAL",
  },
  {
    key: "disoriented",
    name: "Desorientado",
    description:
      "Saturação sensorial psíquica. A mente está envolta em ilusões e luz intensa.",
    mechanic: "Se PER < 6 no início do turno, ataca aliado próximo.",
    resistance: "Inteligência (INT)",
    type: "ESPIRITUAL",
  },
  // --- UNIVERSAIS ---
  {
    key: "bleeding",
    name: "Sangrando",
    description:
      "Ruptura física de tecidos com perda contínua de energia vital.",
    mechanic: "-1d4 Vida/turno (-2d4 se realizar ações pesadas).",
    resistance: "Vitalidade (VIT)",
    type: "UNIVERSAL",
  },
  {
    key: "insane",
    name: "Insano",
    description:
      "A mente rompeu o limite da compreensão dimensional. Falha total de sistema.",
    mechanic: "Sanidade 0. Personagem sob controle do motor do sistema.",
    resistance: "Exposição a Sombra ou Caos",
    type: "UNIVERSAL",
  },
  {
    key: "out_of_control",
    name: "Descontrolado",
    description:
      "Sobrecarga de Nexus. O poder da arma dominou completamente a consciência.",
    mechanic: "+3 FOR, -3 INT. Sem defesa/magia. Perda de Sanidade Máxima.",
    resistance: "Dura até a arma ser embainhada ou o usuário cair.",
    type: "UNIVERSAL",
  },
  {
    key: "stable",
    name: "Estabilizado",
    description: "Sinal vital limpo e conexão Nexus em integridade nominal.",
    mechanic: "Sem penalidades ou bônus ativos. Performance baseline.",
    resistance: "---",
    type: "UNIVERSAL",
  },
];

async function seedDatabase() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("❌ DATABASE_URL não encontrada.");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("📡 Conectando ao Vault para Sincronia de Status...");

    await StatusEffect.deleteMany({});
    await StatusEffect.insertMany(STATUS_TO_SEED);

    console.log("💎 Vault_Update: Status Effects imortalizados.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no Seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
