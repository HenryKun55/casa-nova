import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, Reservation } from "@/db/schema";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validations/product";
import { db, type LocalProduct } from "@/lib/db/local-db";
import { syncManager } from "@/lib/sync/sync-manager";

export type ProductWithReservation = Product & {
  reservation: Reservation | null;
};

export function useProducts() {
  return useQuery<ProductWithReservation[]>({
    queryKey: ["products"],
    queryFn: async () => {
      // 1. Try to get from local database first (local-first)
      const localProducts = await db.products.toArray();

      // 2. If we have local data, return it immediately
      if (localProducts.length > 0) {
        // Convert LocalProduct to ProductWithReservation
        const productsWithReservations = await Promise.all(
          localProducts.map(async (product) => {
            const reservation = product.reservation || await db.reservations.get(product.id);
            return {
              ...product,
              createdAt: new Date(product.createdAt),
              updatedAt: new Date(product.updatedAt),
              reservation: reservation ? {
                ...reservation,
                createdAt: new Date(reservation.createdAt),
              } : null,
            } as ProductWithReservation;
          })
        );

        // 3. Try to sync in background if online
        if (navigator.onLine) {
          fetch("/api/products")
            .then(async (res) => {
              if (res.ok) {
                const serverProducts = await res.json();

                // Update local database
                await db.products.clear();
                await db.products.bulkAdd(
                  serverProducts.map((p: ProductWithReservation) => ({
                    ...p,
                    createdAt: new Date(p.createdAt).toISOString(),
                    updatedAt: new Date(p.updatedAt).toISOString(),
                    reservation: p.reservation,
                    _syncStatus: "synced" as const,
                    _lastSync: new Date().toISOString(),
                  }))
                );
              }
            })
            .catch((err) => {
              console.error("Background sync failed:", err);
            });
        }

        return productsWithReservations;
      }

      // 4. If no local data and online, fetch from server
      if (navigator.onLine) {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erro ao carregar produtos");
        const products = await res.json();

        // Store in local database
        await db.products.bulkAdd(
          products.map((p: ProductWithReservation) => ({
            ...p,
            createdAt: new Date(p.createdAt).toISOString(),
            updatedAt: new Date(p.updatedAt).toISOString(),
            reservation: p.reservation,
            _syncStatus: "synced" as const,
            _lastSync: new Date().toISOString(),
          }))
        );

        return products;
      }

      // 5. Offline and no local data
      throw new Error("Você está offline e não há dados salvos localmente");
    },
  });
}

export function useProduct(id: string) {
  return useQuery<ProductWithReservation>({
    queryKey: ["products", id],
    queryFn: async () => {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar produto");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProductInput) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao criar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProductInput) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao atualizar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao deletar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
