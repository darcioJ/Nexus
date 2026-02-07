import { useContext, useCallback } from "react"; // Adicionado useCallback
import { NotificationContext } from "../contexts/notification/NotificationContext";
import { triggerHaptic } from "../utils/triggerHaptic";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider",
    );
  }

  const notifyError = useCallback(
    (errorOrTitle: any, messageOrFallback?: string) => {
      let title = "Erro de Protocolo";
      let message = "Falha na comunicação com o Core.";

      if (typeof errorOrTitle === "string") {
        title = errorOrTitle;
        message = messageOrFallback || "Dados inconsistentes.";
      } else {
        title = messageOrFallback || "Erro de Protocolo";
        message =
          errorOrTitle?.response?.data?.message ||
          errorOrTitle?.message ||
          message;
      }

      context.notify({ title, message, type: "ERROR" });
      triggerHaptic("HEAVY");
    },
    [context],
  ); // Só muda se o contexto mudar

  const notifySuccess = useCallback(
    (title: string, message: string) => {
      context.notify({
        title: title || "Sinal Estabilizado",
        message: message,
        type: "SUCCESS",
      });
      triggerHaptic("SUCCESS");
    },
    [context],
  );

  return {
    ...context,
    notifyError,
    notifySuccess,
  };
};
