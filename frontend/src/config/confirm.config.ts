import { AlertTriangle, HelpCircle, Info } from "lucide-react";

export type ModalType = "danger" | "warning" | "info";

export const VARIANTS = {
  danger: {
    color: "rose",
    icon: AlertTriangle,
    accent: "bg-rose-500",
    ghost: "bg-rose-50",
    border: "border-rose-100",
    shadow: "shadow-rose-500/40",
    haptic: "HEAVY" as const,
  },
  warning: {
    color: "amber",
    icon: HelpCircle,
    accent: "bg-amber-500",
    ghost: "bg-amber-50",
    border: "border-amber-100",
    shadow: "shadow-amber-500/40",
    haptic: "MEDIUM" as const,
  },
  info: {
    color: "indigo",
    icon: Info,
    accent: "bg-indigo-600",
    ghost: "bg-indigo-50",
    border: "border-indigo-100",
    shadow: "shadow-indigo-500/40",
    haptic: "LIGHT" as const,
  },
};
