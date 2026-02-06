import { useState, useEffect, useCallback, useMemo } from "react"; // Adicionado useMemo
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVault } from "../hooks/useVault";
import {
  characterSchema,
  DEFAULT_VALUES,
  CHAR_LIMITS, // Importado para evitar números mágicos (30)
  type CharacterData,
} from "../models/character";
import { STEPS_DATA as STEPS } from "../config/steps.config";
import { triggerHaptic } from "../utils/triggerHaptic";

export const useDossier = () => {
  const { vault } = useVault();
  const [step, setStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // --- INTERFACES ---
  interface Club {
    _id: string;
    bonus?: {
      attributeKey: keyof CharacterData["attributes"];
      value: number;
    };
  }

  // --- MÉTODOS DO FORM ---
  const methods = useForm<CharacterData>({
    resolver: zodResolver(characterSchema) as Resolver<CharacterData>,
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const { reset, trigger, watch, setValue } = methods;
  const values = watch();

  // --- HELPERS DE LÓGICA ---

  const getFieldsForStep = useCallback((current: number) => {
    return STEPS[current]?.fields || [];
  }, []);

  const getBonusKey = useCallback(
    (originId: string) => {
      if (!vault?.clubs) return null;
      const club = (vault.clubs as Club[]).find((c) => c._id === originId);
      return club?.bonus?.attributeKey || null;
    },
    [vault?.clubs],
  );

  const modifyBonus = useCallback(
    (amount: number) => {
      const attrKey = getBonusKey(values.background.origin);
      if (attrKey) {
        const currentVal = values.attributes[attrKey] || 0;
        setValue(`attributes.${attrKey}`, currentVal + amount);
      }
    },
    [getBonusKey, values.background.origin, values.attributes, setValue],
  );

  // --- VALIDAÇÃO DINÂMICA ---
  const canProceed = useMemo(() => {
    const currentStepConfig = STEPS[step];
    if (!currentStepConfig) return false;

    // Lógica especial para Atributos
    if (currentStepConfig.id === "attributes") {
      const total = Object.values(values.attributes || {}).reduce(
        (acc, curr) => acc + (Number(curr) || 0),
        0,
      );
      return total >= CHAR_LIMITS.MIN_POINTS_REQUIRED;
    }

    // Lógica padrão para outros steps
    const currentFields = getFieldsForStep(step);

    return currentFields.every((field) => {
      const val: any = field.split(".").reduce((obj, key) => obj?.[key], values);

      if (field === "identity.name") {
        return typeof val === "string" && val.length >= 3;
      }

      return !!val;
    });
  }, [step, values, getFieldsForStep]);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const saved = localStorage.getItem("nexus_character");
    if (saved) {
      try {
        reset(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  useEffect(() => {
    if (!isLoaded) return;
    const subscription = watch((value) => {
      localStorage.setItem("nexus_character", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, isLoaded]);

  // --- NAVEGAÇÃO ---

  const nextStep = async () => {
    const isValid = await trigger(getFieldsForStep(step));

    if (isValid) {
      // Se estamos saindo de Atributos, aplicamos o bônus
      if (STEPS[step].id === "attributes") {
        modifyBonus(1);
      }

      setHasError(false);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      triggerHaptic("MEDIUM");
    } else {
      setHasError(true);
      triggerHaptic("HEAVY");
      setTimeout(() => setHasError(false), 4000);
    }
  };

  const prevStep = () => {
    // Se estamos voltando de Armas para Atributos, removemos o bônus
    if (STEPS[step].id === "weapons") {
      modifyBonus(-1);
    }

    triggerHaptic("LIGHT");
    setStep((s) => Math.max(s - 1, 0));
  };

  return {
    methods,
    step,
    nextStep,
    prevStep,
    setHasError,
    hasError,
    canProceed,
    isLastStep: step === STEPS.length - 1,
  };
};
