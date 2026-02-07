import { useContext, useMemo } from "react";
import { NexusContext } from "../contexts/nexus/NexusContext";
import { useVault } from "./useVault";

export const useNexus = () => {
  const context = useContext(NexusContext);
  const { vault, isLoading: vaultLoading } = useVault();

  if (!context) {
    throw new Error("useNexus deve ser consumido dentro de um NexusProvider");
  }

  const populatedCharacter = useMemo(() => {
    if (!context.character || !vault) return context.character;

    const char = context.character;

    // 1. Mapeamento de Arsenal
    const primaryWeapon = vault.weapons?.find(
      (w: any) => w._id === char.weapons?.primary,
    );

    // 2. Mapeamento de Background
    const club = vault.clubs?.find(
      (c: any) => c._id === char.background?.club,
    );
    const archetype = vault.archetypes?.find(
      (a: any) => a._id === char.background?.archetype,
    );

    // 3. Mapeamento de Status Ativo (Agora acessando char.stats.status)
    const status = vault.statusEffects?.find(
      (s: any) => s._id === char.stats?.status,
    );

    // 4. Mapeamento de Atributos
    const attributesDetailed = Object.keys(char.attributes || {}).map((key) => {
      const meta = vault.attributes?.find((a: any) => a.key === key);
      return {
        key,
        value: char.attributes[key],
        ...meta,
      };
    });

    return {
      ...char,
      // Injetamos as versões detalhadas
      weaponDetail: primaryWeapon || null,
      clubDetail: club || null,
      archetypeDetail: archetype || null,
      fullAttributes: attributesDetailed,
      // Atualizamos o objeto stats para incluir o detalhe do status
      stats: {
        ...char.stats,
        statusDetail: status || null,
      },
    };
  }, [context.character, vault]);

  return {
    ...context,
    character: populatedCharacter,
    isSyncing: context.isLoading || vaultLoading,

    // --- ATALHOS RÁPIDOS (Glicose para os componentes) ---
    identity: populatedCharacter?.identity || {},

    // Acessando via sub-objeto stats
    currentStatus: populatedCharacter?.stats?.statusDetail || null,

    equippedWeapon: populatedCharacter?.weaponDetail || null,
    club: populatedCharacter?.clubDetail || null,
    archetype: populatedCharacter?.archetypeDetail || null,

    // Retorna o objeto stats completo (contendo hp, maxHp, san, maxSan, soul, etc)
    stats: populatedCharacter?.stats || {},
  };
};
