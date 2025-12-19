"use client";

import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/hooks/use-products";
import { useReservations } from "@/hooks/use-reservations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Package, Gift, DollarSign, CheckCircle, Target, QrCode } from "lucide-react";
import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants/app-config";
import { QRCodeModal } from "@/components/qr-code-modal";
import { fireGoalConfetti } from "@/lib/utils/confetti";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ProgressRing } from "@/components/ui/progress-ring";
import { FadeIn } from "@/components/ui/fade-in";

export default function DashboardPage() {
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const hasShownConfetti = useRef(false);
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: reservations, isLoading: loadingReservations } = useReservations();

  const totalProducts = products?.length || 0;
  const reservedProducts = products?.filter((p) => p.reservation).length || 0;
  const totalReservations = reservations?.length || 0;

  const totalValue = products?.reduce(
    (acc, p) => acc + Number(p.price) * p.quantity,
    0
  ) || 0;

  const reservedValue = products
    ?.filter((p) => p.reservation)
    .reduce((acc, p) => acc + Number(p.price) * p.quantity, 0) || 0;

  const isLoading = loadingProducts || loadingReservations;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const goalProgress = (reservedValue / APP_CONFIG.fundraisingGoal) * 100;
  const isGoalReached = reservedValue >= APP_CONFIG.fundraisingGoal;

  const listUrl = typeof window !== "undefined"
    ? `${window.location.origin}/list`
    : "";

  useEffect(() => {
    if (isGoalReached && !isLoading && !hasShownConfetti.current) {
      hasShownConfetti.current = true;
      setTimeout(() => {
        fireGoalConfetti();
      }, 500);
    }
  }, [isGoalReached, isLoading]);

  return (
    <>
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={listUrl}
        title="Compartilhar Lista de Presentes"
        description="Compartilhe este QR Code com seus convidados para que eles possam acessar a lista"
      />
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie sua lista de chá de casa nova
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="icon" onClick={() => setQrModalOpen(true)} title="QR Code">
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0.1}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
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
                <AnimatedCounter value={totalProducts} className="text-2xl font-bold" />
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
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
                  <AnimatedCounter value={reservedProducts} className="text-2xl font-bold" />
                  <p className="text-xs text-muted-foreground">
                    {totalProducts > 0
                      ? `${((reservedProducts / totalProducts) * 100).toFixed(0)}% da lista`
                      : "0% da lista"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(totalValue)}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
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
                    {formatCurrency(reservedValue)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalValue > 0
                      ? `${((reservedValue / totalValue) * 100).toFixed(0)}% do total`
                      : "0% do total"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Fundraising Goal Progress */}
      <FadeIn delay={0.5}>
        <Card className={`hover:shadow-lg transition-shadow duration-300 ${isGoalReached ? "border-green-500 bg-green-50/50" : ""}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Meta de Arrecadação
                </CardTitle>
                <CardDescription>
                  Acompanhe o progresso da sua lista de presentes
                </CardDescription>
              </div>
              {isGoalReached && (
                <div className="text-4xl">🎉</div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-48" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <ProgressRing
                      progress={Math.min(goalProgress, 100)}
                      size={140}
                      strokeWidth={10}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">
                          {Math.min(goalProgress, 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(goalProgress, 100)}
                        className={`h-4 ${isGoalReached ? "bg-green-200" : ""}`}
                      />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(reservedValue)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        de {formatCurrency(APP_CONFIG.fundraisingGoal)}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                {isGoalReached ? (
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      Meta Atingida! 🎊
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(reservedValue - APP_CONFIG.fundraisingGoal)} acima da meta
                    </p>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Faltam</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(APP_CONFIG.fundraisingGoal - reservedValue)}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      </FadeIn>

      {/* Recent Reservations */}
      <FadeIn delay={0.6}>
        <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Reservas Recentes</CardTitle>
          <Link href="/dashboard/reservations">
            <Button variant="outline" size="sm">
              Ver Todas
            </Button>
          </Link>
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
          ) : reservations && reservations.length > 0 ? (
            <div className="space-y-4">
              {reservations.slice(0, 5).map((reservation) => (
                <div
                  key={reservation.id}
                  className="border-b pb-4 last:border-0 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{reservation.guestName}</p>
                        <Badge
                          variant={reservation.confirmed ? "default" : "secondary"}
                          className={
                            reservation.confirmed
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : ""
                          }
                        >
                          {reservation.confirmed ? "Confirmado" : "Pendente"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {reservation.product.name} • {formatCurrency(Number(reservation.product.price))}
                      </p>
                      {reservation.guestEmail && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📧 {reservation.guestEmail}
                        </p>
                      )}
                      {reservation.whatsapp && (
                        <p className="text-xs text-muted-foreground">
                          📱 {reservation.whatsapp}
                        </p>
                      )}
                      {reservation.message && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          "{reservation.message}"
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      {new Date(reservation.createdAt).toLocaleDateString("pt-BR")}
                    </div>
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
      </FadeIn>
    </div>
    </>
  );
}
