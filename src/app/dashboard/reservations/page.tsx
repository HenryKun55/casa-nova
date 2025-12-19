"use client";

import { useState } from "react";
import { useReservations, useUpdateReservation } from "@/hooks/use-reservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Search,
  ExternalLink,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportReservationsToExcel, exportReservationsToCSV } from "@/lib/utils/export";

export default function ReservationsPage() {
  const { data: reservations, isLoading } = useReservations();
  const updateReservation = useUpdateReservation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending">("all");

  const handleToggleConfirm = async (reservationId: string, currentStatus: boolean) => {
    try {
      await updateReservation.mutateAsync({
        id: reservationId,
        confirmed: !currentStatus,
      });
      toast.success(
        !currentStatus
          ? "Reserva marcada como recebida! 🎉"
          : "Reserva marcada como pendente"
      );
    } catch (error) {
      toast.error("Erro ao atualizar reserva");
    }
  };

  const formatCurrency = (value: string) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));

  const filteredReservations = reservations?.filter((reservation) => {
    const matchesSearch =
      reservation.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.whatsapp?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "confirmed" && reservation.confirmed) ||
      (statusFilter === "pending" && !reservation.confirmed);

    return matchesSearch && matchesStatus;
  });

  const confirmedCount = reservations?.filter((r) => r.confirmed).length || 0;
  const pendingCount = reservations?.filter((r) => !r.confirmed).length || 0;

  const handleExport = (format: "excel" | "csv") => {
    if (!filteredReservations || filteredReservations.length === 0) {
      toast.error("Nenhuma reserva para exportar");
      return;
    }

    try {
      if (format === "excel") {
        exportReservationsToExcel(filteredReservations);
        toast.success("Planilha Excel baixada com sucesso!");
      } else {
        exportReservationsToCSV(filteredReservations);
        toast.success("Arquivo CSV baixado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao exportar dados");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Reservas</h1>
          <p className="text-muted-foreground">
            Visualize e controle todas as reservas dos convidados
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar para Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Exportar para CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Reservas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{reservations?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Presentes Recebidos
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{confirmedCount}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{pendingCount}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, produto, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="confirmed">Recebidas</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="h-24 w-24 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full max-w-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredReservations && filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Product Image */}
                  {reservation.product.imageUrl && (
                    <div className="relative h-32 w-32 shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={reservation.product.imageUrl}
                        alt={reservation.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {reservation.guestName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reservation.product.name} • {formatCurrency(reservation.product.price)}
                        </p>
                      </div>
                      <Badge
                        variant={reservation.confirmed ? "default" : "secondary"}
                        className={
                          reservation.confirmed
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : ""
                        }
                      >
                        {reservation.confirmed ? (
                          <>
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Recebido
                          </>
                        ) : (
                          <>
                            <Clock className="mr-1 h-3 w-3" />
                            Pendente
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-1">
                      {reservation.guestEmail && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${reservation.guestEmail}`}
                            className="hover:text-foreground hover:underline"
                          >
                            {reservation.guestEmail}
                          </a>
                        </div>
                      )}
                      {reservation.whatsapp && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`https://wa.me/${reservation.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground hover:underline"
                          >
                            {reservation.whatsapp}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Message */}
                    {reservation.message && (
                      <div className="rounded-lg bg-muted p-3">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Mensagem:</p>
                            <p className="text-sm text-muted-foreground italic">
                              "{reservation.message}"
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metadata & Actions */}
                    <div className="flex flex-col gap-3 pt-2 md:flex-row md:items-center md:justify-between">
                      <div className="text-xs text-muted-foreground">
                        Reservado em{" "}
                        {new Date(reservation.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <div className="flex gap-2">
                        {reservation.product.purchaseLink && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={reservation.product.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Ver Produto
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={reservation.confirmed ? "outline" : "default"}
                          onClick={() =>
                            handleToggleConfirm(reservation.id, reservation.confirmed)
                          }
                          disabled={updateReservation.isPending}
                        >
                          {reservation.confirmed ? "Marcar como Pendente" : "Marcar como Recebido"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma reserva encontrada com os filtros aplicados"
                  : "Nenhuma reserva ainda"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
