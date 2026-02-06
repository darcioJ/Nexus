import type { Request, Response } from "express";
import { Archetype } from "../models/Archetype.js";

// 1. CRIAR NOVO ARQUÉTIPO
export const createArchetype = async (req: Request, res: Response) => {
  try {
    const { key, name, description, items, iconName } = req.body;

    // Proteção contra duplicidade de Chave Neural
    const existing = await Archetype.findOne({ key });
    if (existing) {
      return res.status(400).json({ 
        message: "Conflito de Matriz: Já existe um arquétipo com esta chave no sistema." 
      });
    }

    const newArchetype = new Archetype({
      key,
      name,
      description,
      items,
      iconName
    });

    await newArchetype.save();

    console.log(`✨ Nexus_Forge: Novo Arquétipo [${name}] catalogado.`);
    res.status(201).json({ message: "Arquétipo criado com sucesso.", archetype: newArchetype });
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

    const updated = await Archetype.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!updated) {
      return res.status(404).json({ message: "Arquétipo não localizado para reconfiguração." });
    }

    console.log(`🔄 Nexus_Sync: Arquétipo [${updated.name}] atualizado.`);
    res.json({ message: "Sincronia de arquétipo concluída.", archetype: updated });
  } catch (error) {
    console.error("❌ Erro ao atualizar arquétipo:", error);
    res.status(500).json({ message: "Erro na atualização dos dados do arquétipo." });
  }
};

// 3. DELETAR ARQUÉTIPO
export const deleteArchetype = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Archetype.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Alvo não detectado para remoção." });
    }

    console.warn(`🗑️ Nexus_Purge: Arquétipo [${deleted.name}] removido permanentemente.`);
    res.json({ message: "Registro de arquétipo eliminado do Vault." });
  } catch (error) {
    console.error("❌ Erro ao deletar arquétipo:", error);
    res.status(500).json({ message: "Falha crítica na purgação do arquétipo." });
  }
};