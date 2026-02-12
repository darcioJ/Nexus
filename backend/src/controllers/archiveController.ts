import type { Request, Response } from "express";
import Archive, { type IArchive } from "../models/Archive.js";

export const getAllArchives = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Se o user injetado pelo middleware for mestre, vê tudo. Senão, só publicados.
    const query = (req as any).user?.isMaster ? {} : { isPublished: true };
    const archives = await Archive.find(query).sort({ createdAt: -1 });
    res.json(archives);
  } catch (err) {
    res.status(500).json({ message: "Sinal de arquivos interrompido." });
  }
};

export const getArchiveById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const archive = await Archive.findById(req.params.id);
    if (!archive) {
      res.status(404).json({ message: "Log não indexado no banco de dados." });
      return;
    }
    res.json(archive);
  } catch (err) {
    res.status(500).json({ message: "Erro na descriptografia do arquivo." });
  }
};

export const createArchive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const newArchive: IArchive = new Archive(req.body);
    const savedArchive = await newArchive.save();
    res.status(201).json(savedArchive);
  } catch (err) {
    res.status(400).json({ message: "Falha ao injetar dados no Códice." });
  }
};

export const updateArchive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const updated = await Archive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Falha na re-calibragem do registro." });
  }
};

export const deleteArchive = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    await Archive.findByIdAndDelete(req.params.id);
    res.json({ message: "Log incinerado com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao abortar arquivo." });
  }
};
