import {
  Utensils,
  Bed,
  Sofa,
  Bath,
  Zap,
  Home,
  Shirt,
  type LucideIcon,
} from "lucide-react";

export type CategoryInfo = {
  name: string;
  icon: LucideIcon;
  emoji: string;
  color: string;
};

export const CATEGORY_MAP: Record<string, CategoryInfo> = {
  "Cozinha": {
    name: "Cozinha",
    icon: Utensils,
    emoji: "🍳",
    color: "text-amber-700",
  },
  "Quarto": {
    name: "Quarto",
    icon: Bed,
    emoji: "🛏️",
    color: "text-purple-600",
  },
  "Sala": {
    name: "Sala",
    icon: Sofa,
    emoji: "🛋️",
    color: "text-blue-600",
  },
  "Banheiro": {
    name: "Banheiro",
    icon: Bath,
    emoji: "🚿",
    color: "text-cyan-600",
  },
  "Eletrônicos": {
    name: "Eletrônicos",
    icon: Zap,
    emoji: "⚡",
    color: "text-yellow-600",
  },
  "Decoração": {
    name: "Decoração",
    icon: Home,
    emoji: "🏠",
    color: "text-green-600",
  },
  "Outros": {
    name: "Outros",
    icon: Shirt,
    emoji: "✨",
    color: "text-gray-600",
  },
};

export function getCategoryInfo(category: string | null): CategoryInfo {
  if (!category) {
    return {
      name: "Sem categoria",
      icon: Home,
      emoji: "📦",
      color: "text-gray-600",
    };
  }

  return CATEGORY_MAP[category] || {
    name: category,
    icon: Home,
    emoji: "📦",
    color: "text-gray-600",
  };
}
