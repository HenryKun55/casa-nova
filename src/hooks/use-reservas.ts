import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reserva, Produto } from "@/db/schema";
import type { CreateReservaInput } from "@/lib/validations/reserva";

export type ReservaComProduto = Reserva & {
  produto: Produto;
};

export function useReservas() {
  return useQuery<ReservaComProduto[]>({
    queryKey: ["reservas"],
    queryFn: async () => {
      const res = await fetch("/api/reservas");
      if (!res.ok) throw new Error("Erro ao carregar reservas");
      return res.json();
    },
  });
}

export function useCreateReserva() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservaInput) => {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao criar reserva");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
