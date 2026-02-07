import type { Request, Response } from "express";
import { Weapon } from "../models/Weapon.js";
import { Character } from "../models/Character.js";

// 1. FORJAR NOVA ARMA
export const createWeapon = async (req: Request, res: Response) => {
  try {
    const {
      key,
      name,
      typeLabel,
      essenceId,
      range,
      description,
      specialNotes,
    } = req.body;

    // Verificação de Assinatura Única no Arsenal
    const existing = await Weapon.findOne({ key });
    if (existing) {
      return res.status(400).json({
        message:
          "Conflito de Arsenal: Já existe um armamento registrado com esta chave neural.",
      });
    }

    const newWeapon = new Weapon({
      key,
      name,
      typeLabel,
      essenceId,
      range,
      description,
      specialNotes,
    });

    await newWeapon.save();

    // Retornamos a arma populada para o Admin Panel já exibir o ícone/cor da essência
    const populatedWeapon = await Weapon.findById(newWeapon._id).populate({
      path: "essenceId",
      populate: { path: "baseStatusId" },
    });

    console.log(
      `⚔️ Nexus_Forge: Armamento [${name}] forjado e vinculado ao Vault.`,
    );
    res
      .status(201)
      .json({
        message: "Arma registrada com sucesso.",
        weapon: populatedWeapon,
      });
  } catch (error) {
    console.error("❌ Erro ao forjar arma:", error);
    res
      .status(500)
      .json({ message: "Falha na sincronia com o setor de armaria." });
  }
};

// 2. RECONFIGURAR ARMAMENTO
export const updateWeapon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Weapon.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate({
      path: "essenceId",
      populate: { path: "baseStatusId" },
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Arma não localizada nos registros atuais." });
    }

    console.log(
      `🔄 Nexus_Sync: Parâmetros da arma [${updated.name}] recalibrados.`,
    );
    res.json({ message: "Armamento sincronizado.", weapon: updated });
  } catch (error) {
    console.error("❌ Erro ao atualizar arma:", error);
    res.status(500).json({ message: "Erro na recalibragem do armamento." });
  }
};

// 3. PURGAR DO ARSENAL
export const deleteWeapon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Localizar Arma Baseline
    const defaultWeapon = await Weapon.findOne({ key: "fists" });
    if (!defaultWeapon)
      return res
        .status(500)
        .json({ message: "Erro: Arma 'fists' não encontrada no arsenal." });

    if (id === defaultWeapon._id.toString()) {
      return res
        .status(403)
        .json({ message: "Protocolo Negado: O registro 'fists' é vital." });
    }

    // 2. Desarmar personagens (Equipar punhos)
    await Character.updateMany({ "weapons.primary": id } as any, {
      $set: { "weapons.primary": defaultWeapon._id },
    });

    const deleted = await Weapon.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Sinal de armamento não encontrado para remoção." });
    }

    console.warn(
      `🗑️ Vault_Purge: Arma [${deleted.name}] removida permanentemente.`,
    );
    res.json({ message: "Registro de arma eliminado do Vault." });
  } catch (error) {
    console.error("❌ Erro ao deletar arma:", error);
    res
      .status(500)
      .json({ message: "Falha crítica na purgação do armamento." });
  }
};
