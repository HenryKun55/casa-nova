import type { CountryCode } from "@/lib/constants/countries";

export function formatPhone(value: string, countryCode: CountryCode): string {
  const numbers = value.replace(/\D/g, "");

  switch (countryCode) {
    case "BR":
      return formatBrazilianPhone(numbers);
    case "US":
      return formatUSPhone(numbers);
    case "AU":
      return formatAustralianPhone(numbers);
    default:
      return numbers;
  }
}

function formatBrazilianPhone(numbers: string): string {
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

function formatUSPhone(numbers: string): string {
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
}

function formatAustralianPhone(numbers: string): string {
  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
}

export function getPhoneMaxLength(countryCode: CountryCode): number {
  switch (countryCode) {
    case "BR":
      return 15; // (11) 99999-9999
    case "US":
      return 14; // (999) 999-9999
    case "AU":
      return 13; // 0400 000 000
    default:
      return 20;
  }
}
