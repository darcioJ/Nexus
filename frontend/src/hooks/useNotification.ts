import { useContext } from "react";
import { NotificationContext } from "../contexts/notification/NotificationContext";
import { triggerHaptic } from "../utils/triggerHaptic";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider",
    );
  }

  // --- HELPER: NOTIFICAÇÃO DE ERRO (HÍBRIDO: AXIOS OU MANUAL) ---
  const notifyError = (errorOrTitle: any, messageOrFallback?: string) => {
    let title = "Erro de Protocolo";
    let message = "Falha na comunicação com o Core.";

    if (typeof errorOrTitle === "string") {
      // CENÁRIO 2: Você passou strings manuais
      // notifyError("Título", "Mensagem específica")
      title = errorOrTitle;
      message = messageOrFallback || "Dados inconsistentes.";
    } else {
      // CENÁRIO 1: Você passou o objeto de erro do Axios
      // notifyError(error, "Título Opcional")
      title = messageOrFallback || "Erro de Protocolo";
      message =
        errorOrTitle?.response?.data?.message ||
        errorOrTitle?.message ||
        message;
    }

    context.notify({
      title,
      message,
      type: "ERROR",
    });

    triggerHaptic("HEAVY");
  };

  // --- HELPER: NOTIFICAÇÃO DE SUCESSO (PROTOCOLO OK) ---
  const notifySuccess = (title: string, message: string) => {
    context.notify({
      title: title || "Sinal Estabilizado",
      message: message,
      type: "SUCCESS",
    });

    // Feedback tátil de sucesso para reforçar a recompensa do usuário
    triggerHaptic("SUCCESS");
  };

  return {
    ...context,
    notifyError,
    notifySuccess,
  };
};
