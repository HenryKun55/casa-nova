function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (stored === null) return defaultValue;

  if (typeof defaultValue === "number") {
    const parsed = parseFloat(stored);
    return (isNaN(parsed) ? defaultValue : parsed) as T;
  }

  return stored as T;
}

export const APP_CONFIG = {
  get fundraisingGoal(): number {
    return loadFromLocalStorage("fundraisingGoal", 15000);
  },
  set fundraisingGoal(value: number) {
    if (typeof window !== "undefined") {
      localStorage.setItem("fundraisingGoal", value.toString());
    }
  },

  event: {
    name: "Chá de Casa Nova",
    couple: "Henrique & Yasmim",
    get date(): Date {
      const stored = loadFromLocalStorage("eventDate", "2025-06-15");
      return new Date(stored);
    },
    set date(value: Date) {
      if (typeof window !== "undefined") {
        localStorage.setItem("eventDate", value.toISOString().split('T')[0]);
      }
    },
  },

  features: {
    anonymousMode: true,
    pixIntegration: false,
    multipleImages: false,
  },

  pix: {
    get key(): string {
      return loadFromLocalStorage("pixKey", "");
    },
    set key(value: string) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pixKey", value);
      }
    },
    get name(): string {
      return loadFromLocalStorage("pixName", "");
    },
    set name(value: string) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pixName", value);
      }
    },
    get city(): string {
      return loadFromLocalStorage("pixCity", "");
    },
    set city(value: string) {
      if (typeof window !== "undefined") {
        localStorage.setItem("pixCity", value);
      }
    },
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
    window.dispatchEvent(new Event('anonymousModeChanged'));
  }
}
