import { api } from "../api";

export interface VaultData {
  attributes: any[];
  essences: any[];
  archetypes: any[];
  weapons: any[];
  clubs: any[];
  statusEffects: any[];
}

export const vaultService = {
  // 📡 SNAPSHOT: Busca o estado atual de todo o ecossistema Forge
  getSnapshot: async (): Promise<VaultData> => {
    const { data } = await api.get("/forge/data");
    return data.vault;
  },

  // --- ⚔️ ARSENAL (WEAPONS) ---
  saveWeapon: async (weapon: any) => {
    return weapon._id
      ? api.patch(`/weapons/${weapon._id}`, weapon)
      : api.post("/weapons", weapon);
  },
  deleteWeapon: async (id: string) => api.delete(`/weapons/${id}`),

  // --- 🛡️ CLUBES (CLUBS) ---
  saveClub: async (club: any) => {
    return club._id
      ? api.patch(`/clubs/${club._id}`, club)
      : api.post("/clubs", club);
  },
  deleteClub: async (id: string) => api.delete(`/clubs/${id}`),

  // --- ⚡ STATUS EFFECTS ---
  saveStatusEffect: async (effect: any) => {
    return effect._id
      ? api.patch(`/status-effects/${effect._id}`, effect)
      : api.post("/status-effects", effect);
  },
  deleteStatusEffect: async (id: string) => api.delete(`/status-effects/${id}`),

  // --- ✨ ESSÊNCIAS (ESSENCES) ---
  saveEssence: async (essence: any) => {
    return essence._id
      ? api.patch(`/essences/${essence._id}`, essence)
      : api.post("/essences", essence);
  },
  deleteEssence: async (id: string) => api.delete(`/essences/${id}`),

  // --- 📖 ARQUÉTIPOS (ARCHETYPES / KITS) ---
  saveArchetype: async (archetype: any) => {
    return archetype._id
      ? api.patch(`/archetypes/${archetype._id}`, archetype)
      : api.post("/archetypes", archetype);
  },
  deleteArchetype: async (id: string) => api.delete(`/archetypes/${id}`),

  // --- dna ATRIBUTOS (ATTRIBUTES) ---
  saveAttribute: async (attr: any) => {
    return attr._id
      ? api.patch(`/attributes/${attr._id}`, attr)
      : api.post("/attributes", attr);
  },
  deleteAttribute: async (id: string) => api.delete(`/attributes/${id}`),
};
