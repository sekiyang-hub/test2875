export type MedicalTranslation = {
  definition: string;
  examination: string;
  steps: string[];
  sections: { title: string; text: string; items?: string[] }[];
  care: string;
  caution: string;
};
export type MedicalTranslations = Record<string, MedicalTranslation>;
