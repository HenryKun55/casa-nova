"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServiceWorker } from "@/hooks/use-service-worker";

const ONE_MINUTE = 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useServiceWorker();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
