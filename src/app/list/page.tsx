"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { ReservationModal } from "@/components/reservation-modal";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Grid3x3 } from "lucide-react";
import type { ProductWithReservation } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCategoryInfo } from "@/lib/constants/categories";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ListPage() {
  const { data: products, isLoading } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<ProductWithReservation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(products?.map((p) => p.category).filter(Boolean))
  );

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products?.length || 0;
  const reservedProducts = products?.filter((p) => p.reservation).length || 0;
  const progress = totalProducts > 0 ? (reservedProducts / totalProducts) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Chá de Casa Nova
              </h1>
              <p className="text-muted-foreground">
                Escolha um presente especial para nós
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <Link href="/">
                <Button variant="outline">Voltar ao Início</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-lg bg-card p-6 shadow-sm border">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Progresso da Lista</span>
            <span className="text-sm text-muted-foreground">
              {reservedProducts} de {totalProducts} presentes reservados
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950">
            <div
              className="h-full bg-rose-500 dark:bg-rose-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
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

          {categories.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Grid3x3 className="h-4 w-4" />
                Categorias
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="gap-1"
                >
                  <span>✨</span>
                  Todas
                </Button>
                {categories.map((category) => {
                  const categoryInfo = getCategoryInfo(category);
                  const Icon = categoryInfo.icon;
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className="gap-1"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <span>{categoryInfo.emoji}</span>
                      {category}
                      {selectedCategory === category && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1 text-xs">
                          {filteredProducts?.filter(p => p.category === category).length}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
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
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory
                ? "Nenhum produto encontrado com os filtros aplicados"
                : "Ainda não há produtos na lista"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Reserva */}
      <ReservationModal
        product={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
      />
    </div>
  );
}
