import {
  Sword,
  Shield,
  Zap,
  Sparkles,
  BookOpen,
  Dna,
  Layers,
  Biohazard,
  Ghost,
  Crosshair,
  Target,
} from "lucide-react";
import { vaultService } from "../services/vaultService";

// 1. INPUT: Cerâmica Líquida (Refração Esmeralda)
// Foco em clareza, suavidade e um "bloom" sutil ao digitar.
export const inputBaseClass = `
  w-full bg-white/40 backdrop-blur-md 
  border-2 border-white/80 rounded-2xl 
  px-6 py-4 text-sm font-semibold text-slate-600 
  placeholder:text-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]
  hover:bg-white/60 hover:border-slate-100
  focus:bg-white focus:border-indigo-400/60 
  focus:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)]
  transition-all duration-500 outline-none ring-0
`;

// 2. TEXTAREA: Cápsula de Dossiê (Refração Safira)
// Mais orgânico, com bordas profundas para narrativas e lore.
export const textareaBaseClass = `
  w-full bg-white/40 backdrop-blur-md 
  border-2 border-white/80 rounded-[2.5rem] 
  px-8 py-6 text-sm font-medium text-slate-500 italic
  placeholder:text-slate-300 shadow-inner
  hover:bg-white/60 hover:border-slate-100
  focus:bg-white focus:border-indigo-400/60 
  focus:shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]
  transition-all duration-700 outline-none resize-none ring-0
`;

// 3. SELECT: Módulo de Escolha (Refração Âmbar)
// Design de "chip" inserido, com tipografia forte e foco em contraste.
export const selectBaseClass = `
  w-full bg-white/50 backdrop-blur-xl 
  border-2 border-white rounded-2xl 
  px-6 py-4 text-sm font-bold text-slate-600 
  cursor-pointer shadow-[0_5px_15px_-5px_rgba(0,0,0,0.03)]
  hover:bg-white/80 hover:scale-[1.005]
  focus:border-indigo-400/60 focus:bg-white
  focus:shadow-[0_0_25px_-5px_rgba(99,102,241,0.15)]
  transition-all duration-500 outline-none appearance-none ring-0
`;

export const CATEGORY_CONFIG: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  Elemental: { icon: Zap, color: "#10b981", label: "FRQ_NATURAL" }, // Esmeralda
  Corruptora: { icon: Biohazard, color: "#f43f5e", label: "ENT_DECAY" }, // Rose
  Espiritual: { icon: Ghost, color: "#8b5cf6", label: "PSI_GHOST" }, // Violeta
  Universal: { icon: Layers, color: "#3b82f6", label: "SYS_CORE" }, // Safira
};

export const RANGE_CONFIG: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  Curto: { icon: Sword, color: "#10b981", label: "CQC_ENGAGE" }, // Esmeralda
  Médio: { icon: Target, color: "#f59e0b", label: "MID_TACTICAL" }, // Âmbar
  Longo: { icon: Crosshair, color: "#f43f5e", label: "LR_PRECISION" }, // Rose
};

export const VAULT_CONFIG = {
  weapons: {
    label: "Arsenal",
    icon: Sword,
    save: vaultService.saveWeapon,
    delete: vaultService.deleteWeapon,
  },
  clubs: {
    label: "Clubes",
    icon: Shield,
    save: vaultService.saveClub,
    delete: vaultService.deleteClub,
  },
  status: {
    label: "Status",
    icon: Zap,
    save: vaultService.saveStatusEffect,
    delete: vaultService.deleteStatusEffect,
  },
  essences: {
    label: "Essências",
    icon: Sparkles,
    save: vaultService.saveEssence,
    delete: vaultService.deleteEssence,
  },
  archetypes: {
    label: "Arquétipos",
    icon: BookOpen,
    save: vaultService.saveArchetype,
    delete: vaultService.deleteArchetype,
  },
  attributes: {
    label: "Atributos",
    icon: Dna,
    save: vaultService.saveAttribute,
    delete: vaultService.deleteAttribute,
  },
};

export type VaultTab = keyof typeof VAULT_CONFIG;
