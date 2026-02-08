import { api } from "../api";

// --- SUB-INTERFACES PARA PRECISÃO NEURAL ---

export interface IItem {
  name: string;
  category: string;
  description?: string;
  quantity: number;
}

export interface IAttribute {
  _id: string;
  key: string;
  name: string;
  description?: string;
  iconName: string;
  colorVar: string;
  modLabel: string;
  modDiv: number;
  isSystem: boolean;
}

export interface IStatusEffect {
  _id: string;
  key: string;
  name: string;
  description?: string;
  mechanic: string;
  resistance: string;
  category: string;
  iconName: string;
  colorVar: string;
  isSystem: boolean;
}

export interface IEssence {
  _id: string;
  key: string;
  name: string;
  category: string;
  description?: string;
  advantageAgainst: string;
  iconName: string;
  colorVar: string;
  statusId: IStatusEffect; // Já populado pelo ForgeController
  isSystem: boolean;
}

export interface IWeapon {
  _id: string;
  key: string;
  name: string;
  typeLabel: string;
  essenceId: IEssence; // Já populado pelo ForgeController
  range: "Curto" | "Médio" | "Longo";
  description?: string;
  specialNotes: IItem[];
  isSystem: boolean;
}

export interface IClub {
  _id: string;
  key: string;
  name: string;
  description?: string;
  iconName: string;
  bonus: {
    attributeId: IAttribute;
    value: number;
  };
  isSystem: boolean;
}

export interface IArchetype {
  _id: string;
  key: string;
  name: string;
  description?: string;
  iconName: string;
  items: IItem[];
  isSystem: boolean;
}

// --- INTERFACE PRINCIPAL ---
export interface VaultData {
  attributes: IAttribute[];
  essences: IEssence[];
  archetypes: IArchetype[];
  weapons: IWeapon[];
  clubs: IClub[];
  statusEffects: IStatusEffect[];
}

export const vaultService = {
  // 📡 SNAPSHOT: Busca o estado atual de todo o ecossistema Forge
  getSnapshot: async (): Promise<VaultData> => {
    const { data } = await api.get("/forge/data");
    return data.vault;
  },

  // --- ⚔️ ARSENAL (WEAPONS) ---
  saveWeapon: async (weapon: Partial<IWeapon>) => {
    return weapon._id
      ? api.patch(`/weapons/${weapon._id}`, weapon)
      : api.post("/weapons", weapon);
  },
  deleteWeapon: async (id: string) => api.delete(`/weapons/${id}`),

  // --- 🛡️ CLUBES (CLUBS) ---
  saveClub: async (club: Partial<IClub>) => {
    return club._id
      ? api.patch(`/clubs/${club._id}`, club)
      : api.post("/clubs", club);
  },
  deleteClub: async (id: string) => api.delete(`/clubs/${id}`),

  // --- ⚡ STATUS EFFECTS ---
  saveStatusEffect: async (effect: Partial<IStatusEffect>) => {
    return effect._id
      ? api.patch(`/status-effects/${effect._id}`, effect)
      : api.post("/status-effects", effect);
  },
  deleteStatusEffect: async (id: string) => api.delete(`/status-effects/${id}`),

  // --- ✨ ESSÊNCIAS (ESSENCES) ---
  saveEssence: async (essence: Partial<IEssence>) => {
    return essence._id
      ? api.patch(`/essences/${essence._id}`, essence)
      : api.post("/essences", essence);
  },
  deleteEssence: async (id: string) => api.delete(`/essences/${id}`),

  // --- 📖 ARQUÉTIPOS (ARCHETYPES) ---
  saveArchetype: async (archetype: Partial<IArchetype>) => {
    return archetype._id
      ? api.patch(`/archetypes/${archetype._id}`, archetype)
      : api.post("/archetypes", archetype);
  },
  deleteArchetype: async (id: string) => api.delete(`/archetypes/${id}`),

  // --- dna ATRIBUTOS (ATTRIBUTES) ---
  saveAttribute: async (attr: Partial<IAttribute>) => {
    return attr._id
      ? api.patch(`/attributes/${attr._id}`, attr)
      : api.post("/attributes", attr);
  },
  deleteAttribute: async (id: string) => api.delete(`/attributes/${id}`),
};
