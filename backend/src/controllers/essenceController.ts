import type { Request, Response } from "express";
import { Essence } from "../models/Essence.js";
import { Weapon } from "../models/Weapon.js";

// 1. REGISTRAR NOVA ESSÊNCIA
export const createEssence = async (req: Request, res: Response) => {
  try {
    const {
      key,
      name,
      category,
      description,
      advantageAgainst,
      iconName,
      colorVar,
      baseStatusId,
    } = req.body;

    // Verificação de Chave Única para evitar duplicidade elemental
    const existing = await Essence.findOne({ key });
    if (existing) {
      return res.status(400).json({
        message:
          "Erro de Sincronia: Já existe uma essência com esta assinatura no Core.",
      });
    }

    const newEssence = new Essence({
      key,
      name,
      category,
      description,
      advantageAgainst,
      iconName,
      colorVar,
      baseStatusId,
    });

    await newEssence.save();

    console.log(`✨ Vault_Update: Essência [${name}] destilada e catalogada.`);
    res.status(201).json({
      message: "Essência registrada com sucesso.",
      essence: newEssence,
    });
  } catch (error) {
    console.error("❌ Erro ao criar essência:", error);
    res
      .status(500)
      .json({ message: "Falha na destilação da essência no banco de dados." });
  }
};

// 2. RECONFIGURAR ESSÊNCIA
export const updateEssence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // O populate('baseStatusId') é opcional no retorno, mas útil para o Admin confirmar o vínculo
    const updated = await Essence.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("baseStatusId");

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Sinal elemental não localizado." });
    }

    console.log(
      `🔄 Vault_Sync: Parâmetros da essência [${updated.name}] atualizados.`,
    );
    res.json({ message: "Dados da essência sincronizados.", essence: updated });
  } catch (error) {
    console.error("❌ Erro ao atualizar essência:", error);
    res
      .status(500)
      .json({ message: "Erro na modificação dos metadados elementais." });
  }
};

// 3. PURGAR ESSÊNCIA
export const deleteEssence = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const essenceId = id as string;

    // 1. Localizar a Essência de Baseline (Normal)
    const normalEssence = await Essence.findOne({ key: "normal" });

    if (!normalEssence) {
      return res.status(500).json({
        message:
          "Falha de Sistema: Essência 'normal' não detectada. Abortando purgação para evitar órfãos.",
      });
    }

    // 2. Salvaguarda: Impedir a purgação da essência baseline
    if (essenceId === normalEssence._id.toString()) {
      return res.status(403).json({
        message:
          "Ação Negada: A essência 'normal' é a base fundamental do Core e não pode ser removida.",
      });
    }

    // 3. Recalibrar Armas: Substituir a essência deletada pela 'Normal'
    await Weapon.updateMany({ essenceId: essenceId } as any, {
      $set: { essenceId: normalEssence._id },
    });

    const deleted = await Essence.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Alvo não detectado para purgação." });
    }

    console.warn(
      `🗑️ Vault_Purge: Essência [${deleted.name}] removida do Core.`,
    );
    res.json({ message: "Registro elemental eliminado permanentemente." });
  } catch (error) {
    console.error("❌ Erro ao deletar essência:", error);
    res.status(500).json({ message: "Falha crítica na purgação da essência." });
  }
};
