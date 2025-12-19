"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gift, ZoomIn } from "lucide-react";
import Image from "next/image";
import type { ProductWithReservation } from "@/hooks/use-products";
import { ImageViewerModal } from "@/components/image-viewer-modal";
import { getPriorityLevel } from "@/lib/utils/priority";
import { getAnonymousMode } from "@/lib/constants/app-config";

interface ProductCardProps {
  product: ProductWithReservation;
  onReserve?: (product: ProductWithReservation) => void;
  isAdmin?: boolean;
}

export function ProductCard({ product, onReserve, isAdmin = false }: ProductCardProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [anonymousMode, setAnonymousMode] = useState(getAnonymousMode());
  const isReserved = !!product.reservation;
  const priorityLevel = getPriorityLevel(product.priority);

  useEffect(() => {
    const handleAnonymousModeChange = () => {
      setAnonymousMode(getAnonymousMode());
    };

    window.addEventListener('storage', handleAnonymousModeChange);
    window.addEventListener('anonymousModeChanged', handleAnonymousModeChange);

    return () => {
      window.removeEventListener('storage', handleAnonymousModeChange);
      window.removeEventListener('anonymousModeChanged', handleAnonymousModeChange);
    };
  }, []);
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(product.price));

  return (
    <>
      <Card className={`overflow-hidden ${isReserved ? "opacity-75" : ""}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square w-full bg-muted group">
            {product.imageUrl ? (
              <>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                  onClick={() => setImageViewerOpen(true)}
                  className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  aria-label="Ampliar imagem"
                >
                  <div className="bg-white/90 rounded-full p-3">
                    <ZoomIn className="h-6 w-6 text-gray-900" />
                  </div>
                </button>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Gift className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            {isReserved && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
                <Badge variant="secondary" className="text-lg shadow-lg">
                  Reservado
                </Badge>
              </div>
            )}
            {priorityLevel && !isReserved && (
              <div className="absolute top-2 left-2 pointer-events-none">
                <Badge className={`${priorityLevel.bgColor} ${priorityLevel.color} border`}>
                  <span className="mr-1">{priorityLevel.emoji}</span>
                  {priorityLevel.label}
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
        {isReserved && product.reservation && (
          <div className="flex-1 text-sm text-muted-foreground">
            {isAdmin || !anonymousMode
              ? `Reservado por: ${product.reservation.guestName}`
              : "Reservado"}
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

      {product.imageUrl && (
        <ImageViewerModal
          imageUrl={product.imageUrl}
          alt={product.name}
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
        />
      )}
    </>
  );
}
