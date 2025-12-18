import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reservation, Product } from "@/db/schema";
import type { CreateReservationInput } from "@/lib/validations/reservation";

export type ReservationWithProduct = Reservation & {
  product: Product;
};

export function useReservations() {
  return useQuery<ReservationWithProduct[]>({
    queryKey: ["reservations"],
    queryFn: async () => {
      const res = await fetch("/api/reservations");
      if (!res.ok) throw new Error("Erro ao carregar reservas");
      return res.json();
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReservationInput) => {
      const res = await fetch("/api/reservations", {
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
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
