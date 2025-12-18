import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Produto, Reserva } from "@/db/schema";
import type { CreateProdutoInput, UpdateProdutoInput } from "@/lib/validations/produto";

export type ProdutoComReserva = Produto & {
  reserva: Reserva | null;
};

export function useProdutos() {
  return useQuery<ProdutoComReserva[]>({
    queryKey: ["produtos"],
    queryFn: async () => {
      const res = await fetch("/api/produtos");
      if (!res.ok) throw new Error("Erro ao carregar produtos");
      return res.json();
    },
  });
}

export function useProduto(id: string) {
  return useQuery<ProdutoComReserva>({
    queryKey: ["produtos", id],
    queryFn: async () => {
      const res = await fetch(`/api/produtos/${id}`);
      if (!res.ok) throw new Error("Erro ao carregar produto");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProdutoInput) => {
      const res = await fetch("/api/produtos", {
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
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}

export function useUpdateProduto(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProdutoInput) => {
      const res = await fetch(`/api/produtos/${id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
      queryClient.invalidateQueries({ queryKey: ["produtos", id] });
    },
  });
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Erro ao deletar produto");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
