import * as z from "zod";

export const CHAR_LIMITS = {
  TOTAL_POINTS: 42,
  MIN_POINTS_REQUIRED: 30,
  ATTR_MAX: 12,
  ATTR_MAX_BONUS: 11,
} as const;

export const characterSchema = z.object({
  identity: z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    age: z.coerce.number().min(12, "Mínimo 12 anos").max(22, "Máximo 22 anos"), // Sincronizado com ACADEMIC_STAGES
  }),

  background: z.object({
    club: z.string().min(1, "Selecione sua origem"), // Agora recebe o _id do DB
    biography: z
      .string()
      .max(500, "Máximo 500 caracteres")
      .optional()
      .default(""),
    archetype: z.string().min(1, "Escolha um kit inicial"),
  }),

  // MUDANÇA AQUI: Atributos agora é um Record (Mapa de Chaves)
  attributes: z
    .record(z.string(), z.coerce.number().min(1).max(CHAR_LIMITS.ATTR_MAX))
    .refine((attrs) => {
      const total = Object.values(attrs).reduce((acc, curr) => acc + curr, 0);
      return total <= CHAR_LIMITS.TOTAL_POINTS; // Use a constante aqui!
    }, `A soma excede o limite de ${CHAR_LIMITS.TOTAL_POINTS} pontos.`)
    .refine((attrs) => {
      const total = Object.values(attrs).reduce((acc, curr) => acc + curr, 0);
      return total >= CHAR_LIMITS.MIN_POINTS_REQUIRED;
    }, `Você precisa distribuir pelo menos ${CHAR_LIMITS.MIN_POINTS_REQUIRED} pontos.`),

  weapons: z.object({
    primary: z.string().min(1, "Selecione uma arma"), // Agora recebe o _id do DB
  }),
});

export type CharacterData = z.infer<typeof characterSchema>;

type CharacterKeys = keyof typeof characterSchema.shape;

export type StepId = CharacterKeys | "review";

export const DEFAULT_VALUES: CharacterData = {
  identity: { name: "", age: 14 },
  weapons: { primary: "" },
  background: { club: "", biography: "", archetype: "" },
  attributes: {},
};

export const ACADEMIC_STAGES = [
  { min: 12, max: 14, label: "Ensino Fundamental", offset: 5 },
  { min: 15, max: 17, label: "Ensino Médio", offset: 14 },
  { min: 18, max: 22, label: "Ensino Superior", offset: 17 }, // Expandido para ser mais realista
] as const;
