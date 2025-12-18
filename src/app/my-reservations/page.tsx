"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

const COUNTRY_CODES = {
  BR: { code: "+55", placeholder: "(11) 99999-9999", flag: "🇧🇷", name: "Brasil" },
  US: { code: "+1", placeholder: "(999) 999-9999", flag: "🇺🇸", name: "EUA" },
  AU: { code: "+61", placeholder: "0400 000 000", flag: "🇦🇺", name: "Austrália" },
} as const;

const formatPhone = (value: string, countryCode: keyof typeof COUNTRY_CODES): string => {
  const numbers = value.replace(/\D/g, "");

  if (countryCode === "BR") {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }

  if (countryCode === "US") {
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  }

  if (countryCode === "AU") {
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
    return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
  }

  return numbers;
};

interface MyReservation {
  id: string;
  guestName: string;
  guestEmail: string | null;
  whatsapp: string | null;
  message: string | null;
  confirmed: boolean;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    color: string | null;
    imageUrl: string | null;
    purchaseLink: string | null;
  };
}

export default function MyReservationsPage() {
  const [countryCode, setCountryCode] = useState<keyof typeof COUNTRY_CODES>("BR");
  const [whatsapp, setWhatsapp] = useState("");
  const [searchWhatsapp, setSearchWhatsapp] = useState("");

  const { data: reservations, isLoading, error } = useQuery<MyReservation[]>({
    queryKey: ["my-reservations", searchWhatsapp],
    queryFn: async () => {
      if (!searchWhatsapp) return [];

      const response = await fetch(
        `/api/reservations/my?whatsapp=${encodeURIComponent(searchWhatsapp)}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar reservas");
      }

      return response.json();
    },
    enabled: !!searchWhatsapp,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsapp.trim()) {
      const country = COUNTRY_CODES[countryCode];
      const whatsappFormatted = `${country.code} ${whatsapp.trim()}`;
      setSearchWhatsapp(whatsappFormatted);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(price));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
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
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    País
                  </label>
                  <Select
                    value={countryCode}
                    onValueChange={(value) => setCountryCode(value as keyof typeof COUNTRY_CODES)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o país" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COUNTRY_CODES).map(([code, country]) => (
                        <SelectItem key={code} value={code}>
                          {country.flag} {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    WhatsApp
                  </label>
                  <Input
                    type="tel"
                    placeholder={COUNTRY_CODES[countryCode].placeholder}
                    value={whatsapp}
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value, countryCode);
                      setWhatsapp(formatted);
                    }}
                    maxLength={countryCode === "BR" ? 15 : countryCode === "US" ? 14 : 13}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Buscar Reservas
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

        {searchWhatsapp && !isLoading && reservations && reservations.length === 0 && (
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

        {reservations && reservations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Suas Reservas ({reservations.length})
            </h2>

            {reservations.map((reservation) => (
              <Card key={reservation.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    {reservation.product.imageUrl && (
                      <img
                        src={reservation.product.imageUrl}
                        alt={reservation.product.name}
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {reservation.product.name}
                          </h3>
                          {reservation.product.color && (
                            <p className="text-sm text-gray-600">
                              Cor: {reservation.product.color}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant={reservation.confirmed ? "default" : "secondary"}
                          className={
                            reservation.confirmed
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {reservation.confirmed ? (
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

                      {reservation.product.description && (
                        <p className="mb-2 text-sm text-gray-600">
                          {reservation.product.description}
                        </p>
                      )}

                      <p className="mb-2 text-lg font-semibold text-rose-600">
                        {formatPrice(reservation.product.price)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Reservado em: {formatDate(reservation.createdAt)}
                      </p>

                      {reservation.message && (
                        <div className="mt-3 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-medium text-gray-700">
                            Sua mensagem:
                          </p>
                          <p className="text-sm text-gray-600">
                            {reservation.message}
                          </p>
                        </div>
                      )}

                      {reservation.product.purchaseLink && (
                        <a
                          href={reservation.product.purchaseLink}
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
