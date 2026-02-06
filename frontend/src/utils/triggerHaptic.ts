// PRESETS DE HARDWARE: Definindo a "textura" do vibrato
export const HAPTIC_FEEDBACK = {
  LIGHT: 10,       // Toque sutil (Seleção de chip)
  MEDIUM: 20,      // Confirmação de módulo (Next Step)
  HEAVY: [30, 50], // Alerta de erro ou Sincronização final
  SUCCESS: [10, 30, 10], // Feedback de sucesso neural
} as const;

/**
 * Aciona feedback tátil com proteção SSR e validação simplificada.
 */
export const triggerHaptic = (pattern: keyof typeof HAPTIC_FEEDBACK | number | number[]) => {
  // 1. Checagem simplificada com Optional Chaining
  const canVibrate = typeof navigator !== "undefined" && !!navigator?.vibrate;

  if (!canVibrate) return;

  try {
    // 2. Resolução do padrão (Preset ou Valor numérico)
    const activePattern = typeof pattern === "string" 
      ? HAPTIC_FEEDBACK[pattern as keyof typeof HAPTIC_FEEDBACK] 
      : pattern;

    navigator.vibrate(activePattern);
  } catch (error) {
    // 3. Log silencioso em produção para não poluir o console
    if (process.env.NODE_ENV === "development") {
      console.warn("Nexus_Core: Falha na telemetria tátil.", error);
    }
  }
};