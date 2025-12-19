export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const numberValue = parseInt(numbers) / 100;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numberValue);
};

export const parseCurrency = (value: string): number => {
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return 0;
  return parseInt(numbers) / 100;
};

export const formatCurrencyInput = (value: string): string => {
  const numbers = value.replace(/\D/g, "");

  if (!numbers) return "";

  const cents = numbers.slice(-2).padStart(2, "0");
  const reais = numbers.slice(0, -2) || "0";

  const formattedReais = parseInt(reais).toLocaleString("pt-BR");

  return `R$ ${formattedReais},${cents}`;
};

export const formatPhone = (
  value: string,
  countryCode: "BR" | "US" | "AU"
): string => {
  const numbers = value.replace(/\D/g, "");

  if (countryCode === "BR") {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  if (countryCode === "US") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6)
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }

  if (countryCode === "AU") {
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
  }

  return numbers;
};
