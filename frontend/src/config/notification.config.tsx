import {
  ShieldAlert, CheckCircle2,
  AlertTriangle, Info
} from 'lucide-react';

/* --- CONFIGURAÇÃO DE MATRIZ DE ALERTAS --- */
export const NOTIFICATION_VARIANTS = {
  ERROR: {
    color: "#f43f5e", // Rose 500
    icon: ShieldAlert,
    label: "Falha_de_Protocolo",
    statusText: "NX_CRITICAL_ERR"
  },
  SUCCESS: {
    color: "#10b981", // Emerald 500
    icon: CheckCircle2,
    label: "Sincronia_Estável",
    statusText: "NX_STABLE_LINK"
  },
  WARNING: {
    color: "#f59e0b", // Amber 500
    icon: AlertTriangle,
    label: "Interferência_Detectada",
    statusText: "NX_SIGNAL_WEAK"
  },
  INFO: {
    color: "#6366f1", // Indigo 500
    icon: Info,
    label: "Informativo_Nexus",
    statusText: "NX_DATA_INFO"
  }
};