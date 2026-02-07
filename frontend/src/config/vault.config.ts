import { Sword, Shield, Zap, Sparkles, BookOpen, Dna } from "lucide-react";
import { vaultService } from "../services/vaultService";

// 1. INPUT PADRÃO: Cerâmica polida com foco iridescente
export const inputBaseClass =
  "w-full bg-stone-50/40 border-2 border-stone-200/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400/70 shadow-inner hover:border-stone-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_25px_-5px_rgba(99,102,241,0.2)] transition-all duration-300 outline-none ring-0";

// 2. TEXTAREA: Estilo cápsula para textos longos (Lore/Mecânica)
export const textareaBaseClass =
  "w-full bg-stone-50/40 border-2 border-stone-200/50 rounded-[2.5rem] px-7 py-6 text-sm font-bold text-slate-800 placeholder:text-slate-400/70 shadow-inner hover:border-stone-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_30px_-10px_rgba(99,102,241,0.25)] transition-all duration-300 outline-none resize-none ring-0";

// 3. SELECT: Módulo de escolha com profundidade
export const selectBaseClass =
  "w-full bg-stone-50/40 border-2 border-stone-200/50 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 cursor-pointer shadow-inner hover:border-stone-300 focus:bg-white focus:border-indigo-500 focus:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)] transition-all duration-300 outline-none appearance-none ring-0";

export const categories = ["Elemental", "Corruptora", "Espiritual", "Universal"];

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
