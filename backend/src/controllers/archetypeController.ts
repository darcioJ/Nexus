import type { Request, Response } from "express";
import { Archetype } from "../models/Archetype.js";
import { Character } from "../models/Character.js";

// 1. CRIAR NOVO ARQUÉTIPO
export const createArchetype = async (req: Request, res: Response) => {
  try {
    const { key, name, description, items, iconName } = req.body;

    // Proteção contra duplicidade de Chave Neural
    const existing = await Archetype.findOne({ key });
    if (existing) {
      return res.status(400).json({
        message:
          "Conflito de Matriz: Já existe um arquétipo com esta chave no sistema.",
      });
    }

    const newArchetype = new Archetype({
      key,
      name,
      description,
      items,
      iconName,
      isSystem: false,
    });

    await newArchetype.save();

    console.log(`✨ Nexus_Forge: Novo Arquétipo [${name}] catalogado.`);
    res.status(201).json({
      message: "Arquétipo criado com sucesso.",
      archetype: newArchetype,
    });
  } catch (error) {
    console.error("❌ Erro ao criar arquétipo:", error);
    res.status(500).json({ message: "Falha ao gravar arquétipo no Core." });
  }
};

// 2. ATUALIZAR ARQUÉTIPO
export const updateArchetype = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const target = await Archetype.findById(id);
    if (!target)
      return res.status(404).json({ message: "Arquétipo não localizado." });

    // AJUSTE: Impede que qualquer um altere isSystem ou a Key de um sistema
    if (target.isSystem && (updates.key || updates.isSystem !== undefined)) {
      return res.status(403).json({
        message: "Proteção de Núcleo: Proibido alterar metadados de sistema.",
      });
    }

    // SEGURANÇA EXTRA: Impede que um arquétipo comum vire isSystem: true
    if (!target.isSystem) {
      delete updates.isSystem;
    }

    const updated = await Archetype.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Arquétipo não localizado para reconfiguração." });
    }

    console.log(`🔄 Nexus_Sync: Arquétipo [${updated.name}] atualizado.`);
    res.json({
      message: "Sincronia de arquétipo concluída.",
      archetype: updated,
    });
  } catch (error) {
    console.error("❌ Erro ao atualizar arquétipo:", error);
    res
      .status(500)
      .json({ message: "Erro na atualização dos dados do arquétipo." });
  }
};

export const deleteArchetype = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const target = await Archetype.findById(id);
    if (!target)
      return res.status(404).json({ message: "Alvo não detectado." });

    // Se for isSystem, já bloqueia (isso já protege o no_archetype automaticamente)
    if (target.isSystem) {
      return res
        .status(403)
        .json({ message: "Operação Negada: Matriz de sistema protegida." });
    }

    const defaultArchetype = await Archetype.findOne({ key: "no_archetype" });
    if (!defaultArchetype) {
      return res
        .status(500)
        .json({ message: "Falha Crítica: Baseline não encontrada." });
    }

    // Migração de personagens órfãos
    await Character.updateMany(
      { "background.archetype": target._id },
      { $set: { "background.archetype": defaultArchetype._id } },
    );

    await Archetype.findByIdAndDelete(id);
    res.json({ message: "Registro eliminado do Vault." });
  } catch (error) {
    res.status(500).json({ message: "Falha na purgação do arquétipo." });
  }
};
