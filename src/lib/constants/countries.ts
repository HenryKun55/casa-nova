export const COUNTRY_CODES = {
  BR: { code: "+55", placeholder: "(11) 99999-9999", flag: "🇧🇷", name: "Brasil" },
  US: { code: "+1", placeholder: "(999) 999-9999", flag: "🇺🇸", name: "EUA" },
  AU: { code: "+61", placeholder: "0400 000 000", flag: "🇦🇺", name: "Austrália" },
} as const;

export type CountryCode = keyof typeof COUNTRY_CODES;
