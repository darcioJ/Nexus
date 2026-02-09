import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Character } from "../models/Character.js";
import { User } from "../models/User.js";
import { Attribute } from "../models/Attribute.js";

const JWT_SECRET = process.env.JWT_SECRET || "nexus_omega_7";

// --- 1. CRIAR PERSONAGEM (FORGER) ---
export const createCharacter = async (req: Request, res: Response) => {
  try {
    // 1. EXTRAÇÃO SEGURA (Evita Mass Assignment)
    // Não damos spread no req.body inteiro para evitar que enviem 'stats' ou 'userId' falsos
    const { identity, background, attributes, weapons } = req.body;

    // 2. BUSCA ATRIBUTOS DE SISTEMA (Failsafe de Regra de Negócio)
    const systemAttributes = await Attribute.find({ isSystem: true }).select(
      "_id",
    );
    const systemIds = systemAttributes.map((attr) => String(attr._id));

    const sanitizedAttributes: Record<string, number> = {};

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        const isInvalidKey =
          key.includes("[object") || key === "null" || key === "undefined";
        const isSystem = systemIds.includes(key);

        // Só permitimos se a chave for válida E não for um atributo de sistema
        if (!isInvalidKey && !isSystem) {
          sanitizedAttributes[key] = Number(value);
        } else if (isSystem) {
          console.warn(
            `[SECURITY] Tentativa de injetar ponto em atributo de sistema: ${key}`,
          );
        }
      });
    }

    // 3. CRIAÇÃO COM DADOS FILTRADOS
    const newCharacter = await Character.create({
      identity,
      background,
      weapons,
      attributes: sanitizedAttributes,
      // O userId será nulo ou vinculado depois, stats são gerados pelo pre-save do Schema
    });

    const tempToken = jwt.sign(
      { characterId: newCharacter._id, isGuest: true },
      JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.status(201).json({
      message: "Ficha imortalizada com sucesso.",
      token: tempToken,
      character: newCharacter,
    });
  } catch (error: any) {
    console.error("❌ ERRO NA CRIAÇÃO:", error);
    res
      .status(400)
      .json({ error: "Falha na validação neural.", details: error.message });
  }
};

// --- 2. BUSCAR TODOS (VISÃO DO MESTRE) ---
export const getAllCharacters = async (req: Request, res: Response) => {
  try {
    const allCharacters = await Character.find().sort({ "identity.name": 1 });
    res.json(allCharacters);
  } catch (error) {
    res.status(500).json({ error: "Falha ao varrer o Vault de personagens." });
  }
};

// --- 3. BUSCAR MINHA FICHA (DASHBOARD) ---
export const getMyCharacter = async (req: any, res: Response) => {
  try {
    let character;

    // Se for convidado, usa o ID do token. Se logado, usa o userId vinculado.
    if (req.user.isGuest) {
      character = await Character.findById(req.user.characterId);
    } else {
      character = await Character.findOne({ userId: req.user.userId });
    }

    if (!character) {
      return res
        .status(404)
        .json({ message: "Nenhuma ficha encontrada no Vault." });
    }

    res.json(character);
  } catch (error) {
    res.status(500).json({ error: "Erro ao acessar o Vault." });
  }
};

// --- 4. ATUALIZAR FICHA (RECALIBRAGEM) ---
export const updateCharacter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Bloqueamos a alteração manual de stats sensíveis via update comum
    // para evitar que o player "hackeie" o HP/SAN pelo JSON
    delete updates.stats;
    delete updates.userId;

    const char = await Character.findById(id);
    if (!char) return res.status(404).json({ error: "Sinal não localizado." });

    // Injetamos as atualizações no documento
    // O Mongoose lida bem com Object.assign para Maps e arrays
    Object.assign(char, updates);

    // .save() dispara o middleware syncCharacterStats (pre-validate)
    await char.save();

    const updatedChar = await Character.findById(id).populate(
      "background.club background.archetype weapons.primary stats.status",
    );

    if (!updatedChar) {
      return res
        .status(404)
        .json({ error: "Sinal não localizado para recalibragem." });
    }

    console.log(
      `🔄 Nexus_Sync: Ficha [${updatedChar.identity.name}] recalibrada.`,
    );
    res.json({
      message: "Sinal sincronizado com sucesso.",
      character: updatedChar,
    });
  } catch (error: any) {
    console.error("❌ ERRO NA ATUALIZAÇÃO:", error);
    res
      .status(400)
      .json({ error: "Falha na sincronia neural.", details: error.message });
  }
};

// --- 5. DELETAR FICHA (PURGAÇÃO TOTAL) ---
export const deleteCharacter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Localizamos o personagem para identificar o vínculo de usuário
    const character = await Character.findById(id);

    if (!character) {
      return res.status(404).json({ error: "Sinal já inexistente no Vault." });
    }

    const linkedUserId = character.userId;

    // 2. Removemos o Personagem
    await Character.findByIdAndDelete(id);

    // 3. Purgação em Cascata: Se houver um usuário associado, ele também é deletado
    if (linkedUserId) {
      await User.findByIdAndDelete(linkedUserId);
      console.warn(
        `🗑️ Nexus_Purge: Usuário associado [${linkedUserId}] removido.`,
      );
    }

    console.warn(
      `🗑️ Vault_Purge: Personagem [${character.identity.name}] apagado permanentemente.`,
    );

    res.json({
      message:
        "Purgação concluída. Personagem e conta associada removidos do Core.",
      deletedCharId: id,
      userPurged: !!linkedUserId,
    });
  } catch (error) {
    console.error("❌ ERRO NA PURGAÇÃO:", error);
    res.status(500).json({ error: "Falha crítica na purgação dos dados." });
  }
};

export const modulateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stat, value } = req.body;

    const char = await Character.findById(id);
    if (!char) return res.status(404).json({ error: "Sinal não encontrado." });

    // Modulação dentro do objeto stats
    if (stat === "hp") {
      char.stats.hp = Math.min(
        Math.max(char.stats.hp + value, 0),
        char.stats.maxHp,
      );
    } else if (stat === "san") {
      char.stats.san = Math.min(
        Math.max(char.stats.san + value, 0),
        char.stats.maxSan,
      );
    }

    await char.save();

    const io = req.app.get("socketio");
    if (io) {
      // 📡 ATUALIZAÇÃO: Enviamos para o canal global (Mestre) e privado (Player)
      // Incluímos o charId para o MasterPanel identificar o card
      const payload = {
        charId: id,
        stat,
        newValue: (char.stats as any)[stat],
      };

      io.to(id).emit("status_update", payload); // Pro Player
      io.to("nexus_table").emit("status_update", payload); // Pro Mestre
    }

    res.json({ message: "Sinal modulado", stats: char.stats });
  } catch (error) {
    res.status(500).json({ error: "Falha na modulação neural." });
  }
};

export const updateCondition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;

    const char = await Character.findByIdAndUpdate(
      id,
      { "stats.status": statusId }, // Caminho aninhado correto
      { new: true },
    );

    if (!char) return res.status(404).json({ error: "Sinal não encontrado." });

    const io = req.app.get("socketio");
    if (io) {
      const payload = {
        charId: id,
        statusId: statusId,
      };

      // Notifica o player e a mesa do mestre
      io.to(id).emit("condition_update", payload);
      io.to("nexus_table").emit("condition_update", payload);
    }

    res.json({ message: "Condição atualizada", status: char.stats.status });
  } catch (error) {
    res.status(500).json({ error: "Falha na sincronia de estado." });
  }
};
