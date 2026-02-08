import type { Request, Response } from "express";
import { Attribute } from "../models/Attribute.js";
import { Essence } from "../models/Essence.js";
import { Archetype } from "../models/Archetype.js";
import { Weapon } from "../models/Weapon.js";
import { Club } from "../models/Club.js";
import { StatusEffect } from "../models/StatusEffect.js";
import { applyVaultFilter } from "../middleware/authMiddleware.js";

interface VaultRequest extends Request {
  vaultFilter?: Record<string, any>;
  user?: {
    userId?: string;
    isGuest?: boolean;
    role?: string;
  };
}

export const getForgeData = async (req: VaultRequest, res: Response) => {
  try {
    // Pegamos o filtro injetado pelo middleware (ou um objeto vazio como fallback)
    const filter = req.vaultFilter || {};

    console.log(
      `📡 Vault_Pulse: Sincronizando com filtro: ${JSON.stringify(filter)}`,
    );

    const [attributes, essences, archetypes, weapons, clubs, statusEffects] =
      await Promise.all([
        // 1. Atributos (Já ordenado)
        Attribute.find(filter).sort({ name: 1 }),

        // 2. Essências (Adicionado Sort)
        Essence.find(filter).populate("statusId").sort({ name: 1 }),

        // 3. Arquétipos (Já ordenado)
        Archetype.find(filter).sort({ name: 1 }),

        // 4. Armas (Adicionado Sort)
        Weapon.find(filter)
          .populate({
            path: "essenceId",
            populate: { path: "statusId" },
          })
          .sort({ name: 1 }),

        // 5. Clubes (Já ordenado)
        Club.find(filter).populate("bonus.attributeId").sort({ name: 1 }),

        // 6. Efeitos de Status (Já ordenado)
        StatusEffect.find(filter).sort({ name: 1 }),
      ]);

    res.json({
      version: "2.1.0-STABLE",
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
  } catch (error) {
    console.error("❌ Falha Crítica na Varredura do Vault:", error);
    res.status(500).json({ error: "Erro na sincronia de dados." });
  }
};
