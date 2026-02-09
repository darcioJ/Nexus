import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgerContext } from "./ForgerContext";
import { characterSchema, DEFAULT_VALUES, CHAR_LIMITS, CharacterData } from "../../models/character";
import { STEPS_DATA as STEPS } from "../../config/steps.config";
import { useVault } from "../../hooks/useVault";
import { triggerHaptic } from "../../utils/triggerHaptic";

export const ForgerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { vault } = useVault();
  const [step, setStep] = useState(0);
  const [hasError, setHasError] = useState(false);

  // 1. HIDRATAÇÃO INICIAL (Síncrona via useMemo para evitar flash de conteúdo)
  const savedData = useMemo(() => {
    const saved = localStorage.getItem("nexus_character");
    try {
      return saved ? JSON.parse(saved) : DEFAULT_VALUES;
    } catch {
      return DEFAULT_VALUES;
    }
  }, []);

  const methods = useForm<CharacterData>({
    resolver: zodResolver(characterSchema),
    defaultValues: savedData,
    mode: "onChange",
  });

  const { trigger, setValue, getValues } = methods;
  const values = useWatch({ control: methods.control });

  // 2. HELPER: BUSCA DE BÔNUS (Mantendo sua correção de IDs populados)
  const getBonusId = useCallback((clubId: string) => {
    if (!vault?.clubs) return null;
    const club = vault.clubs.find((c) => String(c._id) === String(clubId));
    const attrId = club?.bonus?.attributeId?._id || club?.bonus?.attributeId;
    return attrId ? String(attrId) : null;
  }, [vault]);

  const modifyBonus = useCallback((amount: number) => {
    const currentValues = getValues();
    const attrId = getBonusId(currentValues.background.club);
    if (attrId) {
      const currentVal = Number(currentValues.attributes[attrId]) || 0;
      setValue(`attributes.${attrId}`, currentVal + amount, { shouldValidate: true });
    }
  }, [getBonusId, getValues, setValue]);

  // 3. VALIDAÇÃO DE PASSO
  const canProceed = useMemo(() => {
    const currentStepConfig = STEPS[step];
    if (!currentStepConfig) return false;

    if (currentStepConfig.id === "attributes") {
      const total = Object.values(values.attributes || {}).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
      return total >= CHAR_LIMITS.MIN_POINTS_REQUIRED;
    }

    return currentStepConfig.fields.every((field) => {
      const val = field.split(".").reduce((obj, key) => obj?.[key], values);
      return field === "identity.name" ? (typeof val === "string" && val.length >= 3) : !!val;
    });
  }, [step, values]);

  // 4. AUTO-SAVE (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("nexus_character", JSON.stringify(values));
    }, 800);
    return () => clearTimeout(timer);
  }, [values]);

  // 5. NAVEGAÇÃO
  const nextStep = async () => {
    const fields = STEPS[step]?.fields || [];
    const isValid = await trigger(fields as any);

    if (isValid) {
      if (STEPS[step].id === "attributes") modifyBonus(1);
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      triggerHaptic("MEDIUM");
    } else {
      setHasError(true);
      triggerHaptic("HEAVY");
      setTimeout(() => setHasError(false), 4000);
    }
  };

  const prevStep = () => {
    if (STEPS[step].id === "weapons") modifyBonus(-1);
    setStep((s) => Math.max(s - 1, 0));
    triggerHaptic("LIGHT");
  };

  return (
    <ForgerContext.Provider value={{ 
      methods, step, hasError, canProceed, 
      isLastStep: step === STEPS.length - 1,
      nextStep, prevStep, setStep 
    }}>
      {children}
    </ForgerContext.Provider>
  );
};