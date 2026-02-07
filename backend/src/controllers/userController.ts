import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { Character } from "../models/Character.js";

// 1. LISTAR TODOS OS USUÁRIOS (Para o UserManager)
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Retornamos todos os usuários, mas ocultamos o campo password por segurança
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      timestamp: new Date().toISOString(),
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("❌ Erro ao listar usuários:", error);
    res
      .status(500)
      .json({ message: "Falha na varredura da base de dados de usuários." });
  }
};

// 2. ATUALIZAR PERFIL / CARGO (Promover ou Editar)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, role, email } = req.body;

    // Impedir que um mestre se auto-rebaixe acidentalmente (opcional, mas seguro)
    if (id === req.user.userId && role === "PLAYER") {
      return res.status(400).json({
        message:
          "Protocolo de Segurança: Você não pode remover seu próprio nível de Mestre.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, role, email },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Usuário não localizado no setor de registros." });
    }

    console.log(
      `👤 Nexus_Auth: Usuário [${updatedUser.name}] reconfigurado para [${updatedUser.role}].`,
    );
    res.json({ message: "Sincronia de usuário concluída.", user: updatedUser });
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res
      .status(500)
      .json({ message: "Erro na modificação dos dados de acesso." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const targetUserId = id as string;

    // 1. Proteção contra auto-deleção
    if (targetUserId === req.user.userId) {
      return res.status(400).json({
        message: "Operação Negada: Impossível auto-expulsão do sistema.",
      });
    }
    
    const characterPurge = await Character.deleteMany({
      userId: targetUserId,
    } as any);

    // 3. Purgação do Usuário
    const deletedUser = await User.findByIdAndDelete(targetUserId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "Assinatura de usuário não encontrada." });
    }

    // Log detalhado no servidor
    console.warn(
      `🗑️ Nexus_Auth: Conta [${deletedUser.name}] e ${characterPurge.deletedCount} personagens revogados.`,
    );

    // Resposta rica para o Admin
    res.json({
      message: "Usuário e ativos vinculados eliminados permanentemente.",
      details: {
        userName: deletedUser.name,
        purgedCharacters: characterPurge.deletedCount,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao deletar usuário:", error);
    res.status(500).json({ message: "Falha crítica na purgação da conta." });
  }
};
