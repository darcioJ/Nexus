import { ACADEMIC_STAGES } from "../models/character";

export const getSchoolGrade = (age: number): string => {
  // 1. Localiza o estágio acadêmico correspondente
  const stage = ACADEMIC_STAGES.find((s) => age >= s.min && age <= s.max);

  if (!stage) return "Estudante_Externo";

  // 2. Calcula o ano atual dentro do ciclo (Automação de Offset)
  const currentYear = age - stage.offset;

  // 3. Formata a string de saída seguindo o padrão Prisma Nexus
  return `${currentYear}º Ano - ${stage.label}`;
};
