"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log("Service Worker registered:", registration);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                toast.info("Nova versão disponível! Recarregue a página para atualizar.", {
                  duration: 10000,
                  action: {
                    label: "Recarregar",
                    onClick: () => window.location.reload(),
                  },
                });
              }
            });
          }
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);
}
