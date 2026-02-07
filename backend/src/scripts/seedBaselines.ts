import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// --- IMPORTAÇÃO DE MODELOS ---
import { Archetype } from "../models/Archetype.js";
import { Attribute } from "../models/Attribute.js";
import { Club } from "../models/Club.js";
import { Essence } from "../models/Essence.js";
import { StatusEffect } from "../models/StatusEffect.js";
import { Weapon } from "../models/Weapon.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function seedBaselines() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("❌ DATABASE_URL não configurada.");

  try {
    console.log(
      "🛰️ Nexus_Core: Iniciando purgação e recalibragem de baselines...",
    );
    await mongoose.connect(uri);

    // 🧹 LIMPEZA TOTAL (Cuidado: Isso apaga tudo!)
    await Promise.all([
      StatusEffect.deleteMany({}),
      Attribute.deleteMany({}),
      Essence.deleteMany({}),
      Club.deleteMany({}),
      Archetype.deleteMany({}),
      Weapon.deleteMany({}),
    ]);
    console.log("🧹 Vault_Clean: Todas as coleções foram purgadas.");

    const no_archetype = {
      key: "no_archetype",
      name: "Recruta",
      description:
        "Protocolo de treinamento básico. Sem especialização definida ou registros de arquétipo vinculados.",
      iconName: "ShieldAlert",
      items: [
        {
          name: "Uniforme de Recruta",
          category: "EQUIPAMENTO",
          description:
            "Tecido sintético de proteção padrão para novos operativos.",
          quantity: 1,
        },
      ],
      isSystem: true,
    };

    const no_attribute = {
      key: "no_attribute",
      name: "Protocolo Base",
      description:
        "Matriz de dados neutra. Utilizada como âncora para cálculos de sistema onde nenhum bônus específico é detectado.",
      iconName: "Activity",
      colorVar: "#cbd5e1",
      modLabel: "Sinal Base",
      modDiv: 1,
      isSystem: true,
    };

    const no_club = {
      key: "no_club",
      name: "Independente",
      iconName: "User",
      description:
        "Protocolo para operativos sem afiliação formal a facções, clubes de treino ou divisões especializadas.",
      bonus: {
        value: 0,
      },
      isSystem: true,
    };

    const normal_essence = {
      key: "normal",
      name: "Cinética",
      category: "Universal",
      description:
        "Energia bruta sem propriedades elementares ou alinhamentos espirituais. É a frequência fundamental da matéria no Continuum.",
      advantageAgainst: "Nenhuma (Equilíbrio Neutro)",
      iconName: "Zap",
      colorVar: "#94a3b8", // Slate-400
      isSystem: true,
    };

    const stable_status = {
      key: "stable",
      name: "Estável",
      description:
        "O sinal vital opera em frequências nominais. Não há interferências anômalas ou degradação de tecido detectada.",
      mechanic:
        "Nenhum modificador aplicado. O sistema recupera integridade conforme o protocolo padrão.",
      resistance: "Imunidade Adaptativa",
      category: "Universal",
      iconName: "Activity",
      colorVar: "#10b981", // Emerald-500
      isSystem: true,
    };

    const no_weapon = {
      key: "no_weapon",
      name: "Punhos",
      typeLabel: "Combate Desarmado",
      range: "Curto",
      description:
        "Capacidade básica de autodefesa utilizando força física bruta e técnicas de combate corpo-a-corpo. Protocolo padrão quando nenhum armamento letal está equipado.",
      specialNotes: [
        {
          category: "REQUISITO",
          content: "Nenhum. Disponível para todos os operativos do Nexus.",
        },
        {
          category: "LIMITAÇÃO",
          content:
            "Dano base reduzido e alcance restrito ao contato direto com o alvo.",
        },
      ],
      isSystem: true,
    };

    // --- 1. STATUS (O Primeiro de todos) ---
    const stable = await StatusEffect.create(stable_status);
    console.log("✅ Baseline: Status 'stable' imortalizado.");

    // --- 2. ATRIBUTO (Base para Clubes) ---
    const attr = await Attribute.create(no_attribute);
    console.log("✅ Baseline: Atributo 'no_attribute' imortalizado.");

    // --- 3. ESSÊNCIA (Depende do Status) ---
    // Injetamos o ID do status criado no passo 1
    const essence = await Essence.create({
      ...normal_essence,
      statusId: stable._id,
    });

    console.log("✅ Baseline: Essência 'normal' imortalizada.");

    // --- 4. CLUBE (Depende do Atributo) ---
    // Injetamos o ID do atributo criado no passo 2
    await Club.create({
      ...no_club,
      bonus: { ...no_club.bonus, attributeId: attr._id },
    });
    console.log("✅ Baseline: Clube 'no_club' imortalizado.");

    // --- 5. ARQUÉTIPO ---
    await Archetype.create(no_archetype);
    console.log("✅ Baseline: Arquétipo 'no_archetype' imortalizado.");

    // --- 6. ARMA (Depende da Essência) ---
    // Injetamos o ID da essência criada no passo 3
    await Weapon.create({
      ...no_weapon,
      essenceId: essence._id,
    });
    console.log("✅ Baseline: Arma 'no_weapon' imortalizada.");

    console.log(
      "\n💎 NEXUS_CORE_SYNC: Matriz primordial recalibrada com sucesso.",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Falha crítica no Seeding:", error);
    process.exit(1);
  }
}

seedBaselines();
