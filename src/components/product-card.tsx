"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Gift } from "lucide-react";
import Image from "next/image";
import type { ProdutoComReserva } from "@/hooks/use-produtos";

interface ProductCardProps {
  produto: ProdutoComReserva;
  onReservar?: (produto: ProdutoComReserva) => void;
  isAdmin?: boolean;
}

export function ProductCard({ produto, onReservar, isAdmin = false }: ProductCardProps) {
  const isReservado = !!produto.reserva;
  const precoFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(produto.preco));

  return (
    <Card className={`overflow-hidden ${isReservado ? "opacity-75" : ""}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          {produto.imagemUrl ? (
            <Image
              src={produto.imagemUrl}
              alt={produto.nome}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Gift className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {isReservado && (
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
            <h3 className="font-semibold leading-tight">{produto.nome}</h3>
            {produto.categoria && (
              <Badge variant="outline" className="shrink-0">
                {produto.categoria}
              </Badge>
            )}
          </div>
          {produto.descricao && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {produto.descricao}
            </p>
          )}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-primary">{precoFormatado}</p>
            {produto.cor && (
              <span className="text-sm text-muted-foreground">Cor: {produto.cor}</span>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        {!isReservado && onReservar && (
          <Button onClick={() => onReservar(produto)} className="flex-1">
            <Gift className="mr-2 h-4 w-4" />
            Quero dar esse!
          </Button>
        )}
        {isReservado && isAdmin && produto.reserva && (
          <div className="flex-1 text-sm text-muted-foreground">
            Reservado por: {produto.reserva.nomeConvidado}
          </div>
        )}
        {produto.linkCompra && (
          <Button variant="outline" size="icon" asChild>
            <a href={produto.linkCompra} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
