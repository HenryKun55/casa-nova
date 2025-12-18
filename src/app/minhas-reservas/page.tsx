"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MinhaReserva {
  id: string;
  nomeConvidado: string;
  emailConvidado: string | null;
  whatsapp: string | null;
  mensagem: string | null;
  confirmado: boolean;
  createdAt: Date;
  produto: {
    id: string;
    nome: string;
    descricao: string | null;
    preco: string;
    cor: string | null;
    imagemUrl: string | null;
    linkCompra: string | null;
  };
}

export default function MinhasReservasPage() {
  const [whatsapp, setWhatsapp] = useState("");
  const [whatsappBusca, setWhatsappBusca] = useState("");

  const { data: reservas, isLoading, error } = useQuery<MinhaReserva[]>({
    queryKey: ["minhas-reservas", whatsappBusca],
    queryFn: async () => {
      if (!whatsappBusca) return [];

      const response = await fetch(
        `/api/reservas/minhas?whatsapp=${encodeURIComponent(whatsappBusca)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar reservas");
      }

      return response.json();
    },
    enabled: !!whatsappBusca,
  });

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp.trim()) {
      setWhatsappBusca(whatsapp.trim());
    }
  };

  const formatarPreco = (preco: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(preco));
  };

  const formatarData = (data: Date) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a lista
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Minhas Reservas
          </h1>
          <p className="text-lg text-gray-600">
            Consulte os presentes que você reservou
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Buscar Reservas</CardTitle>
            <CardDescription>
              Digite o WhatsApp que você usou ao fazer a reserva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBuscar} className="flex gap-2">
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                <span className="ml-2">Buscar</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-center text-red-600">
                Erro ao buscar reservas. Tente novamente.
              </p>
            </CardContent>
          </Card>
        )}

        {whatsappBusca && !isLoading && reservas && reservas.length === 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-center text-yellow-800">
                Nenhuma reserva encontrada com este WhatsApp.
                <br />
                Verifique se o número está correto.
              </p>
            </CardContent>
          </Card>
        )}

        {reservas && reservas.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Suas Reservas ({reservas.length})
            </h2>

            {reservas.map((reserva) => (
              <Card key={reserva.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    {reserva.produto.imagemUrl && (
                      <img
                        src={reserva.produto.imagemUrl}
                        alt={reserva.produto.nome}
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {reserva.produto.nome}
                          </h3>
                          {reserva.produto.cor && (
                            <p className="text-sm text-gray-600">
                              Cor: {reserva.produto.cor}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={reserva.confirmado ? "default" : "secondary"}
                          className={
                            reserva.confirmado
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {reserva.confirmado ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Confirmado
                            </>
                          ) : (
                            <>
                              <Clock className="mr-1 h-3 w-3" />
                              Pendente
                            </>
                          )}
                        </Badge>
                      </div>

                      {reserva.produto.descricao && (
                        <p className="mb-2 text-sm text-gray-600">
                          {reserva.produto.descricao}
                        </p>
                      )}

                      <p className="mb-2 text-lg font-semibold text-rose-600">
                        {formatarPreco(reserva.produto.preco)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Reservado em: {formatarData(reserva.createdAt)}
                      </p>

                      {reserva.mensagem && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-medium text-gray-700">
                            Sua mensagem:
                          </p>
                          <p className="text-sm text-gray-600">
                            {reserva.mensagem}
                          </p>
                        </div>
                      )}

                      {reserva.produto.linkCompra && (
                        <a
                          href={reserva.produto.linkCompra}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block"
                        >
                          <Button variant="outline" size="sm">
                            Ver Produto
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
