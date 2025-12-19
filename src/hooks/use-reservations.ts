import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Reservation, Product } from "@/db/schema";
import type { CreateReservationInput, UpdateReservationInput } from "@/lib/validations/reservation";

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
      const tempId = `temp_${Date.now()}`;
      const localReservation = {
        id: tempId,
        productId: data.productId,
        guestName: data.guestName,
        guestEmail: data.guestEmail ?? null,
        whatsapp: data.whatsapp ?? null,
        message: data.message ?? null,
        confirmed: false,
        paid: false,
        createdAt: new Date().toISOString(),
        _syncStatus: "pending" as const,
      };

      const { db } = await import("@/lib/db/local-db");
      const { syncManager } = await import("@/lib/sync/sync-manager");

      await db.reservations.add(localReservation);

      if (navigator.onLine) {
        try {
          const res = await fetch("/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || "Erro ao criar reserva");
          }

          const serverReservation = await res.json();

          await db.reservations.delete(tempId);
          await db.reservations.add({
            ...serverReservation,
            createdAt: new Date(serverReservation.createdAt).toISOString(),
            _syncStatus: "synced" as const,
            _lastSync: new Date().toISOString(),
          });

          return serverReservation;
        } catch (error) {
          await syncManager.addToQueue("create", "reservation", tempId, data);
          throw error;
        }
      } else {
        await syncManager.addToQueue("create", "reservation", tempId, data);
        return localReservation;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateReservationInput & { id: string }) => {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao atualizar reserva");
      }
      const updatedReservation = await res.json();

      const { db } = await import("@/lib/db/local-db");
      await db.reservations.update(id, {
        ...data,
        _syncStatus: "synced" as const,
        _lastSync: new Date().toISOString(),
      });

      return updatedReservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
