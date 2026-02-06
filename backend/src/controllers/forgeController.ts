import type { Request, Response } from "express";
import { Attribute } from "../models/Attribute.js";
import { Essence } from "../models/Essence.js";
import { Archetype } from "../models/Archetype.js";
import { Weapon } from "../models/Weapon.js";
import { Club } from "../models/Club.js";
import { StatusEffect } from "../models/StatusEffect.js";

export const getForgeData = async (req: Request, res: Response) => {
  try {
    console.log(
      "📡 Vault_Pulse: Iniciando sincronia de metadados dimensionais...",
    );

    // Execução paralela de todas as coleções do Core
    const [attributes, essences, archetypes, weapons, clubs, statusEffects] =
      await Promise.all([
        Attribute.find().sort({ label: 1 }),

        Essence.find().populate("baseStatusId"),

        Archetype.find().sort({ name: 1 }),
        Weapon.find().populate({
          path: "essenceId",
          populate: { path: "baseStatusId" },
        }),

        Club.find().sort({ name: 1 }),

        StatusEffect.find().sort({ name: 1 }),
      ]);

    // Retornamos um objeto de resposta estruturado e com metadados de sincronia
    res.json({
      version: "2.0.0-PROCESSED",
      timestamp: new Date().toISOString(),
      vault: {
        attributes,
        essences,
        archetypes,
        weapons,
        clubs,
        statusEffects,
      },
    });

    console.log(
      `💎 Vault_Sync: ${weapons.length} armas e ${essences.length} essências sincronizadas.`,
    );
  } catch (error) {
    console.error("❌ Falha Crítica na Varredura do Vault:", error);
    res.status(500).json({
      error: "O sinal do Vault está instável. Falha na sincronia de dados.",
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
