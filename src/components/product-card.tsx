"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gift } from "lucide-react";
import Image from "next/image";
import type { ProductWithReservation } from "@/hooks/use-products";

interface ProductCardProps {
  product: ProductWithReservation;
  onReserve?: (product: ProductWithReservation) => void;
  isAdmin?: boolean;
}

export function ProductCard({ product, onReserve, isAdmin = false }: ProductCardProps) {
  const isReserved = !!product.reservation;
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  return (
    <Card className={`overflow-hidden ${isReserved ? "opacity-75" : ""}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gift className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {isReserved && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Badge variant="secondary" className="text-lg">
                Reservado
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{product.name}</h3>
            {product.category && (
              <Badge variant="outline" className="shrink-0">
                {product.category}
              </Badge>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary">{formattedPrice}</p>
            {product.color && (
              <span className="text-sm text-muted-foreground">Cor: {product.color}</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {!isReserved && onReserve && (
          <Button onClick={() => onReserve(product)} className="flex-1">
            <Gift className="mr-2 h-4 w-4" />
            Quero dar esse!
          </Button>
        )}
        {isReserved && isAdmin && product.reservation && (
          <div className="flex-1 text-sm text-muted-foreground">
            Reservado por: {product.reservation.guestName}
          </div>
        )}
        {product.purchaseLink && (
          <Button variant="outline" size="icon" asChild>
            <a href={product.purchaseLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
