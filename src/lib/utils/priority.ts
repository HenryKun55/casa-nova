export type PriorityLevel = {
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
};

export function getPriorityLevel(priority: number): PriorityLevel | null {
  if (priority >= 3) {
    return {
      label: "Essencial",
      emoji: "🔥",
      color: "text-red-700 dark:text-red-300",
      bgColor: "bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-700",
    };
  }

  if (priority === 2) {
    return {
      label: "Importante",
      emoji: "⭐",
      color: "text-yellow-700 dark:text-yellow-300",
      bgColor: "bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700",
    };
  }

  if (priority === 1) {
    return {
      label: "Desejável",
      emoji: "💡",
      color: "text-blue-700 dark:text-blue-300",
      bgColor: "bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700",
    };
  }

  return null;
}
