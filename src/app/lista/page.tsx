"use client";

import { useState } from "react";
import { useProdutos } from "@/hooks/use-produtos";
import { ProductCard } from "@/components/product-card";
import { ReservaModal } from "@/components/reserva-modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { ProdutoComReserva } from "@/hooks/use-produtos";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ListaPage() {
  const { data: produtos, isLoading } = useProdutos();
  const [selectedProduto, setSelectedProduto] = useState<ProdutoComReserva | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  const categorias = Array.from(
    new Set(produtos?.map((p) => p.categoria).filter(Boolean))
  );

  const produtosFiltrados = produtos?.filter((produto) => {
    const matchesSearch = produto.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategoria =
      !selectedCategoria || produto.categoria === selectedCategoria;
    return matchesSearch && matchesCategoria;
  });

  const totalProdutos = produtos?.length || 0;
  const produtosReservados = produtos?.filter((p) => p.reserva).length || 0;
  const progresso = totalProdutos > 0 ? (produtosReservados / totalProdutos) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-rose-600">
                Chá de Casa Nova
              </h1>
              <p className="text-muted-foreground">
                Escolha um presente especial para nós
              </p>
            </div>
            <Link href="/">
              <Button variant="outline">Voltar ao Início</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progresso */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Progresso da Lista</span>
            <span className="text-sm text-muted-foreground">
              {produtosReservados} de {totalProdutos} presentes reservados
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-rose-100">
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar presente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {categorias.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategoria === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategoria(null)}
              >
                Todas
              </Button>
              {categorias.map((categoria) => (
                <Button
                  key={categoria}
                  variant={selectedCategoria === categoria ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoria(categoria)}
                >
                  {categoria}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Grid de Produtos */}
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
        ) : produtosFiltrados && produtosFiltrados.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {produtosFiltrados.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onReservar={setSelectedProduto}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm || selectedCategoria
                ? "Nenhum produto encontrado com os filtros aplicados"
                : "Ainda não há produtos na lista"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      <ReservaModal
        produto={selectedProduto}
        open={!!selectedProduto}
        onOpenChange={(open) => !open && setSelectedProduto(null)}
      />
    </div>
  );
}
