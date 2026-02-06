import { Sword, Shield, Zap, Sparkles, BookOpen, Dna } from 'lucide-react';
import { vaultService } from '../services/vaultService';

export const VAULT_CONFIG = {
  weapons: { label: 'Arsenal', icon: Sword, save: vaultService.saveWeapon, delete: vaultService.deleteWeapon },
  clubs: { label: 'Clubes', icon: Shield, save: vaultService.saveClub, delete: vaultService.deleteClub },
  status: { label: 'Status', icon: Zap, save: vaultService.saveStatusEffect, delete: vaultService.deleteStatusEffect },
  essences: { label: 'Essências', icon: Sparkles, save: vaultService.saveEssence, delete: vaultService.deleteEssence },
  archetypes: { label: 'Kits', icon: BookOpen, save: vaultService.saveArchetype, delete: vaultService.deleteArchetype },
  attributes: { label: 'Atributos', icon: Dna, save: vaultService.saveAttribute, delete: vaultService.deleteAttribute },
};

export type VaultTab = keyof typeof VAULT_CONFIG;