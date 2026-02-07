import { User, Sword, Shield, BookOpen, ScrollText } from 'lucide-react';

interface Step {
  id: string;
  fields: string[];
  error: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  secondary: string;
  desc: string;
}

export const STEPS_DATA: Step[] = [
  {
    id: 'identity',
    fields: ["identity.name", "identity.age"], // 👈 Adicione isso
    error: "Protocolo Nominal ou Frequência Etária inválidos.",
    title: 'Identidade',
    icon: <User size={20} />,
    color: 'var(--color-step-identity)',
    secondary: 'var(--color-step-identity-soft)',
    desc: 'Estabelecendo conexão neural e registro de cidadão...'
  },
  {
    id: 'background',
    fields: ["background.club", "background.archetype"],
    error: "Clube ou Arsenal não detectados.",
    title: 'Histórico',
    icon: <BookOpen size={20} />,
    color: 'var(--color-step-background)',
    secondary: 'var(--color-step-background-soft)',
    desc: 'Sincronizando memórias e arquétipos de vivência...'
  },
  {
    id: 'attributes',
    fields: ["attributes.strength", "attributes.agility", "attributes.vitality", "attributes.intelligence", "attributes.perception", "attributes.essence"],
    error: "Sincronia Energética insuficiente (Mínimo 30 NX).",
    title: 'Atributos',
    icon: <Shield size={20} />,
    color: 'var(--color-step-attributes)',
    secondary: 'var(--color-step-attributes-soft)',
    desc: 'Otimizando performance biológica e neural...'
  },
  {
    id: 'weapons',
    fields: ["weapons.primary"],
    error: "Vínculo de combate não estabelecido.",
    title: 'Armas',
    icon: <Sword size={20} />,
    color: 'var(--color-step-weapons)',
    secondary: 'var(--color-step-weapons-soft)',
    desc: 'Vinculando arsenal e frequências de combate...'
  },
  {
    id: 'review',
    fields: [],
    error: "Inconsistência de dados detectada.",
    title: 'Revisão',
    icon: <ScrollText size={20} />,
    color: 'var(--color-step-review)',
    secondary: 'var(--color-step-review-soft)',
    desc: 'Finalizando compilação e selagem do perfil NX...'
  },
] as const;