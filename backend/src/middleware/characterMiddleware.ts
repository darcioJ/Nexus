import { model } from "mongoose";

export const syncCharacterStats = async function (this: any) {
  const char = this;

  // 1. SINCRONIA DE STATUS BASELINE
  if (char.isNew && !char.stats.status) {
    try {
      // Importante: usar model() dentro da função para evitar problemas de carregamento
      const stableStatus = await model("StatusEffect").findOne({
        key: "stable",
      });

      if (stableStatus) {
        char.stats.status = stableStatus._id;
      } else {
        // Em funções async, usamos throw em vez de next(err)
        throw new Error(
          "[NEXUS_CRITICAL_ERROR]: Status 'stable' não localizado.",
        );
      }
    } catch (err) {
      throw err; // Repassa o erro para o Mongoose capturar
    }
  }

  // 2. EXTRAÇÃO E VALIDAÇÃO DE ATRIBUTOS
  const attributes = char.attributes;
  if (attributes) {
    const values =
      attributes instanceof Map
        ? Array.from(attributes.values())
        : Object.values(attributes);

    const totalNX = values.reduce(
      (acc: number, curr: any) => acc + (Number(curr) || 0),
      0,
    );

    if (totalNX > 43)
      throw new Error(`[NEXUS_OVERLOAD]: Soma ${totalNX} excede o limite.`);
    if (totalNX < 30)
      throw new Error(`[NEXUS_LOW_SIGNAL]: Soma ${totalNX} insuficiente.`);

    // 3. CÁLCULO DE STATS (HP/SAN)
    const vit = Number(char.get("attributes.vitality")) || 0;
    const int = Number(char.get("attributes.intelligence")) || 0;
    const ess = Number(char.get("attributes.essence")) || 0;

    char.stats.maxHp = 90 + vit * 2;
    char.stats.maxSan = 30 + (int + ess);

    if (char.isNew) {
      char.stats.hp = char.stats.maxHp;
      char.stats.san = char.stats.maxSan;
    }
  }

  // Em funções async, NÃO chamamos next().
  // O Mongoose prossegue assim que a função termina.
};
