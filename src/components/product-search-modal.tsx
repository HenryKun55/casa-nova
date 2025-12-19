"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { parsePrice, detectCategory } from "@/lib/services/serper";
import type { SerperShoppingResult } from "@/lib/services/serper";

interface ProductSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProduct: (product: {
    name: string;
    price: string;
    imageUrl: string;
    purchaseLink: string;
    category: string | null;
  }) => void;
}

export function ProductSearchModal({
  open,
  onOpenChange,
  onSelectProduct,
}: ProductSearchModalProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SerperShoppingResult[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("Digite o que você procura");
      return;
    }

    setIsSearching(true);
    setResults([]);

    try {
      const response = await fetch("/api/search-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();
      setResults(data.results || []);

      if (data.results.length === 0) {
        toast.info("Nenhum resultado encontrado. Tente outra busca!");
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao buscar produtos. Tente novamente!");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (result: SerperShoppingResult) => {
    const category = detectCategory(result.title);

    onSelectProduct({
      name: result.title,
      price: parsePrice(result.price).toFixed(2),
      imageUrl: result.imageUrl || "",
      purchaseLink: result.link,
      category,
    });
  };

  const formatCurrency = (price: string) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parsePrice(price));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Buscar Produto com IA
          </DialogTitle>
          <DialogDescription>
            Descreva o produto que você procura e vamos buscar em várias lojas para você!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Ex: Geladeira Consul Frost Free, Sofá 3 lugares, Jogo de panelas..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              disabled={isSearching}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Procurando os melhores produtos...
                  </p>
                </div>
              </div>
            )}

            {!isSearching && results.length === 0 && query && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum resultado. Tente outra busca!
                </p>
              </div>
            )}

            {results.map((result, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectProduct(result)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    {result.imageUrl && (
                      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={result.imageUrl}
                          alt={result.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-2 mb-1">
                        {result.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant="outline">{result.source}</Badge>
                        {detectCategory(result.title) && (
                          <Badge variant="secondary">
                            {detectCategory(result.title)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(result.price)}
                        </p>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                      {result.delivery && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {result.delivery}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
