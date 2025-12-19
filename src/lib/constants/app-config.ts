/**
 * Application configuration
 * Centralized settings for the gift registry app
 */

export const APP_CONFIG = {
  fundraisingGoal: 15000,

  event: {
    name: "Chá de Casa Nova",
    couple: "Henrique & Yasmim",
    date: new Date("2025-06-15"),
  },

  features: {
    anonymousMode: true,
    pixIntegration: false,
    multipleImages: false,
  },
};

export function getAnonymousMode(): boolean {
  if (typeof window === "undefined") return APP_CONFIG.features.anonymousMode;
  const stored = localStorage.getItem("anonymousMode");
  return stored !== null ? stored === "true" : APP_CONFIG.features.anonymousMode;
}

export function setAnonymousMode(enabled: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("anonymousMode", enabled.toString());
  }
}
