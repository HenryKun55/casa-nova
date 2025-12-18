"use client";

import { useProdutos } from "@/hooks/use-produtos";
import { useReservas } from "@/hooks/use-reservas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Gift, DollarSign, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: produtos, isLoading: loadingProdutos } = useProdutos();
  const { data: reservas, isLoading: loadingReservas } = useReservas();

  const totalProdutos = produtos?.length || 0;
  const produtosReservados = produtos?.filter((p) => p.reserva).length || 0;
  const totalReservas = reservas?.length || 0;

  const valorTotal = produtos?.reduce(
    (acc, p) => acc + Number(p.preco) * p.quantidade,
    0
  ) || 0;

  const valorReservado = produtos
    ?.filter((p) => p.reserva)
    .reduce((acc, p) => acc + Number(p.preco) * p.quantidade, 0) || 0;

  const isLoading = loadingProdutos || loadingReservas;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Gerencie sua lista de chá de casa nova
          </p>
        </div>
        <Link href="/dashboard/produtos">
          <Button>
            <Package className="mr-2 h-4 w-4" />
            Gerenciar Produtos
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{totalProdutos}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Reservados
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{produtosReservados}</div>
                <p className="text-xs text-muted-foreground">
                  {totalProdutos > 0
                    ? `${((produtosReservados / totalProdutos) * 100).toFixed(0)}% da lista`
                    : "0% da lista"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(valorTotal)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Reservado
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(valorReservado)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {valorTotal > 0
                    ? `${((valorReservado / valorTotal) * 100).toFixed(0)}% do total`
                    : "0% do total"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Reservas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : reservas && reservas.length > 0 ? (
            <div className="space-y-4">
              {reservas.slice(0, 5).map((reserva) => (
                <div
                  key={reserva.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{reserva.nomeConvidado}</p>
                    <p className="text-sm text-muted-foreground">
                      {reserva.produto.nome} • {formatCurrency(Number(reserva.produto.preco))}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(reserva.createdAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Nenhuma reserva ainda
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
