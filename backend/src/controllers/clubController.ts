import type { Request, Response } from "express";
import { Club } from "../models/Club.js";
import { Character } from "../models/Character.js";

// 1. CRIAR NOVO CLUBE
export const createClub = async (req: Request, res: Response) => {
  try {
    const { key, name, iconName, description, bonus } = req.body;

    // Verificação de duplicidade de chave (Unique Key)
    const existingClub = await Club.findOne({ key });
    if (existingClub) {
      return res.status(400).json({ 
        message: "Operação Abortada: Já existe um clube registrado com esta chave neural." 
      });
    }

    const newClub = new Club({
      key,
      name,
      iconName,
      description,
      bonus
    });

    await newClub.save();

    console.log(`✅ Vault_Update: Clube [${name}] imortalizado no Core.`);
    res.status(201).json({ message: "Clube registrado com sucesso.", club: newClub });
  } catch (error) {
    console.error("❌ Erro ao criar clube:", error);
    res.status(500).json({ message: "Falha na sincronia com o banco de dados." });
  }
};

// 2. ATUALIZAR CLUBE EXISTENTE
export const updateClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedClub = await Club.findByIdAndUpdate(id, updates, { 
      new: true, // Retorna o objeto já atualizado
      runValidators: true // Garante que as validações do Schema rodem no update
    });

    if (!updatedClub) {
      return res.status(404).json({ message: "Clube não localizado no setor atual." });
    }

    console.log(`🔄 Vault_Sync: Dados do clube [${updatedClub.name}] atualizados.`);
    res.json({ message: "Dados sincronizados.", club: updatedClub });
  } catch (error) {
    console.error("❌ Erro ao atualizar clube:", error);
    res.status(500).json({ message: "Erro interno ao modificar registro." });
  }
};

// 3. DELETAR CLUBE
export const deleteClub = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Localizar o Clube Baseline
    const defaultClub = await Club.findOne({ key: "no_club" });
    if (!defaultClub) return res.status(500).json({ message: "Erro: Clube 'no_club' não encontrado." });

    if (id === defaultClub._id.toString()) {
      return res.status(403).json({ message: "Protocolo Negado: Impossível deletar o clube de baseline." });
    }

    // 2. Migrar personagens para o baseline
    await Character.updateMany(
      { "background.club": id } as any,
      { $set: { "background.club": defaultClub._id } }
    );


    const deletedClub = await Club.findByIdAndDelete(id);

    if (!deletedClub) {
      return res.status(404).json({ message: "Sinal não encontrado para purgação." });
    }

    console.warn(`🗑️ Vault_Purge: Clube [${deletedClub.name}] removido do sistema.`);
    res.json({ message: "Registro removido permanentemente do Vault." });
  } catch (error) {
    console.error("❌ Erro ao deletar clube:", error);
    res.status(500).json({ message: "Falha crítica na purgação do registro." });
  }
};