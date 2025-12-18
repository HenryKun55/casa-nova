"use client";

import { useState } from "react";
import { useProdutos, useDeleteProduto } from "@/hooks/use-produtos";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProdutoForm } from "@/components/produto-form";
import { ProductCard } from "@/components/product-card";
import { toast } from "sonner";
import type { ProdutoComReserva } from "@/hooks/use-produtos";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProdutosPage() {
  const { data: produtos, isLoading } = useProdutos();
  const deleteProduto = useDeleteProduto();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<ProdutoComReserva | null>(null);
  const [deletingProduto, setDeletingProduto] = useState<ProdutoComReserva | null>(null);

  const handleDelete = async () => {
    if (!deletingProduto) return;

    try {
      await deleteProduto.mutateAsync(deletingProduto.id);
      toast.success("Produto deletado com sucesso!");
      setDeletingProduto(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao deletar produto");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Produtos</h1>
          <p className="text-muted-foreground">
            Adicione, edite ou remova produtos da sua lista
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : produtos && produtos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {produtos.map((produto) => (
            <div key={produto.id} className="relative">
              <ProductCard produto={produto} isAdmin />
              <div className="mt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setEditingProduto(produto)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setDeletingProduto(produto)}
                  disabled={!!produto.reserva}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Deletar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="mb-4 text-muted-foreground">
            Você ainda não tem produtos cadastrados
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Produto
          </Button>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Adicione um novo produto à sua lista de presentes
            </DialogDescription>
          </DialogHeader>
          <ProdutoForm onSuccess={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProduto}
        onOpenChange={(open) => !open && setEditingProduto(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça alterações no produto selecionado
            </DialogDescription>
          </DialogHeader>
          {editingProduto && (
            <ProdutoForm
              produto={editingProduto}
              onSuccess={() => setEditingProduto(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deletingProduto}
        onOpenChange={(open) => !open && setDeletingProduto(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto {deletingProduto?.nome} será
              permanentemente removido da lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduto.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
