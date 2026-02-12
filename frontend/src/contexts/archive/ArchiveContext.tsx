import { createContext } from "react";
import type { IArchive, ArchivePayload } from "../../services/archiveService";

interface ArchiveContextData {
  archives: IArchive[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<IArchive | undefined>;
  addArchive: (payload: ArchivePayload) => Promise<void>;
  editArchive: (id: string, payload: ArchivePayload) => Promise<void>;
  removeArchive: (id: string) => Promise<void>;
}

export const ArchiveContext = createContext<ArchiveContextData>(
  {} as ArchiveContextData
);