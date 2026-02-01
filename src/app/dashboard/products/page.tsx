"use client";

import { useState } from "react";
import { useProducts, useDeleteProduct } from "@/hooks/use-products";
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
import { Plus, Pencil, Trash2, Sparkles, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductForm } from "@/components/product-form";
import { ProductCard } from "@/components/product-card";
import { ProductSearchModal } from "@/components/product-search-modal";
import { toast } from "sonner";
import type { ProductWithReservation } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithReservation | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductWithReservation | null>(null);
  const [prefilledData, setPrefilledData] = useState<any>(null);

  const handleDelete = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success("Produto deletado com sucesso!");
      setDeletingProduct(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao deletar produto");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Gerenciar Produtos</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Adicione, edite ou remova produtos da sua lista
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchModalOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Buscar com IA
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex-1 sm:flex-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
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
      ) : products && products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} isAdmin />

              {/* Menu de ações no canto superior direito */}
              <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingProduct(product)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      {/* Search Modal with AI */}
      <ProductSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        onSelectProduct={(product) => {
          setPrefilledData(product);
          setIsCreateDialogOpen(true);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) setPrefilledData(null);
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Adicione um novo produto à sua lista de presentes
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSuccess={() => {
              setIsCreateDialogOpen(false);
              setPrefilledData(null);
            }}
            initialData={prefilledData}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingProduct}
        onOpenChange={(open) => !open && setEditingProduct(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Faça alterações no produto selecionado
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog
        open={!!deletingProduct}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O produto {deletingProduct?.name} será
              permanentemente removido da lista.
              {deletingProduct?.reservation && (
                <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400">
                  Este produto foi reservado por {deletingProduct.reservation.guestName}. A reserva também será removida.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteProduct.isPending ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
