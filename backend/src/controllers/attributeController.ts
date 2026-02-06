import type { Request, Response } from "express";
import { Attribute } from "../models/Attribute.js";

// 1. REGISTRAR NOVO ATRIBUTO
export const createAttribute = async (req: Request, res: Response) => {
  try {
    const { key, label, name, iconName, colorVar, description, details, modLabel, modDiv } = req.body;

    // Verificação de Integridade: Chave Única
    const existing = await Attribute.findOne({ key });
    if (existing) {
      return res.status(400).json({ 
        message: "Conflito de Matriz: Este atributo já está definido no Core." 
      });
    }

    const newAttribute = new Attribute({
      key,
      label,
      name,
      iconName,
      colorVar,
      description,
      details,
      modLabel,
      modDiv
    });

    await newAttribute.save();

    console.log(`🧬 Nexus_Bio: Atributo [${name}] injetado no sistema.`);
    res.status(201).json({ message: "Atributo catalogado com sucesso.", attribute: newAttribute });
  } catch (error) {
    console.error("❌ Erro ao criar atributo:", error);
    res.status(500).json({ message: "Falha crítica na gravação do atributo." });
  }
};

// 2. RECONFIGURAR ATRIBUTO
export const updateAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Attribute.findByIdAndUpdate(id, updates, { 
      new: true, 
      runValidators: true 
    });

    if (!updated) {
      return res.status(404).json({ message: "Atributo não localizado no banco de dados." });
    }

    console.log(`🔄 Nexus_Sync: Parâmetros de [${updated.name}] reconfigurados.`);
    res.json({ message: "Sincronia de atributos concluída.", attribute: updated });
  } catch (error) {
    console.error("❌ Erro ao atualizar atributo:", error);
    res.status(500).json({ message: "Erro na atualização dos metadados do atributo." });
  }
};

// 3. PURGAR ATRIBUTO
export const deleteAttribute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Attribute.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Sinal não detectado para purgação." });
    }

    console.warn(`🗑️ Nexus_Purge: Atributo [${deleted.name}] removido permanentemente.`);
    res.json({ message: "Atributo eliminado do Vault." });
  } catch (error) {
    console.error("❌ Erro ao deletar atributo:", error);
    res.status(500).json({ message: "Falha na purgação do registro de atributo." });
  }
};