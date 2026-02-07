import type { Request, Response } from "express";
import { StatusEffect } from "../models/StatusEffect.js";
import { Essence } from "../models/Essence.js";
import { Character } from "../models/Character.js";
import { Types } from "mongoose";

// 1. REGISTRAR NOVO EFEITO DE STATUS
export const createStatusEffect = async (req: Request, res: Response) => {
  try {
    const {
      key,
      name,
      description,
      mechanic,
      resistance,
      category,
      iconName,
      colorVar,
    } = req.body;

    // Verificação de Assinatura Única
    const existing = await StatusEffect.findOne({ key });
    if (existing) {
      return res.status(400).json({
        message:
          "Erro de Sobrecarga: Já existe uma condição registrada com esta assinatura.",
      });
    }

    const newEffect = new StatusEffect({
      key,
      name,
      description,
      mechanic,
      resistance,
      category,
      iconName,
      colorVar,
      isSystem: false,
    });

    await newEffect.save();

    console.log(
      `🧪 Vault_Update: Condição [${name}] injetada na matriz de status.`,
    );
    res
      .status(201)
      .json({ message: "Efeito de Status catalogado.", effect: newEffect });
  } catch (error) {
    console.error("❌ Erro ao criar efeito de status:", error);
    res
      .status(500)
      .json({ message: "Falha na gravação da bio-alteração no Core." });
  }
};

// 2. RECONFIGURAR EFEITO DE STATUS
export const updateStatusEffect = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const target = await StatusEffect.findById(id);
    if (!target)
      return res.status(404).json({ message: "Matriz não localizada." });

    // AJUSTE: Proteção de Núcleo (isSystem)
    if (target.isSystem && (updates.key || updates.isSystem !== undefined)) {
      return res.status(403).json({
        message: "Proteção de Núcleo: Proibido alterar chaves de sistema.",
      });
    }

    if (!target.isSystem) delete updates.isSystem;

    const updated = await StatusEffect.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, // Crucial aqui para validar o ENUM (ELEMENTAL, CORRUPTORA, etc)
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Matriz de status não localizada para ajuste." });
    }

    console.log(
      `🔄 Vault_Sync: Parâmetros da condição [${updated.name}] reconfigurados.`,
    );
    res.json({ message: "Sincronia de status concluída.", effect: updated });
  } catch (error) {
    console.error("❌ Erro ao atualizar efeito de status:", error);
    res
      .status(500)
      .json({ message: "Erro na modificação dos metadados de condição." });
  }
};

// 3. PURGAR EFEITO DE STATUS
export const deleteStatusEffect = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const target = await StatusEffect.findById(id);
    if (!target)
      return res.status(404).json({ message: "Alvo não detectado." });

    // AJUSTE: Bloqueio por flag isSystem (protege o 'stable' automaticamente)
    if (target.isSystem) {
      return res
        .status(403)
        .json({ message: "Operação Negada: Protocolo de sistema protegido." });
    }

    const statusId = id as string;

    const stableStatus = await StatusEffect.findOne({ key: "stable" });

    if (!stableStatus) {
      return res.status(500).json({
        message:
          "Falha Crítica: Status 'stable' não encontrado no Core. Impossível desvincular dependências.",
      });
    }

    if (id === stableStatus._id.toString()) {
      return res.status(403).json({
        message:
          "Ação Negada: O protocolo 'stable' é um baseline do sistema e não pode ser removido.",
      });
    }

    await Essence.updateMany({ statusId: statusId } as any, {
      statusId: stableStatus._id,
    });

    // 2. AJUSTE: Recalibrar Personagens (Garante que ninguém fique com status órfão)
    await Character.updateMany(
      { "stats.status": target._id },
      { $set: { "stats.status": stableStatus._id } },
    );

    const deleted = await StatusEffect.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Sinal de condição não encontrado para remoção." });
    }

    console.warn(
      `🗑️ Vault_Purge: Condição [${deleted.name}] removida do Core.`,
    );
    res.json({ message: "Efeito de status eliminado permanentemente." });
  } catch (error) {
    console.error("❌ Erro ao deletar efeito de status:", error);
    res
      .status(500)
      .json({ message: "Falha crítica na purgação do registro de status." });
  }
};
