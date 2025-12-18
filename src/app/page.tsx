"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, Heart, Home, Search } from "lucide-react";

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_DATE || "2025-06-15");

    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white">
            <Home className="h-12 w-12" />
          </div>

          {/* Title */}
          <h1 className="mb-4 text-5xl font-bold text-rose-600 md:text-7xl">
            Chá de Casa Nova
          </h1>
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Estamos construindo nosso lar e você faz parte dessa história
          </p>

          {/* Countdown */}
          <div className="mb-12">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Contagem Regressiva para o Grande Dia
            </p>
            <div className="flex justify-center gap-4">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div
                  key={unit}
                  className="flex flex-col items-center rounded-lg bg-white p-4 shadow-lg"
                >
                  <span className="text-3xl font-bold text-rose-600 md:text-4xl">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {unit === "days"
                      ? "Dias"
                      : unit === "hours"
                      ? "Horas"
                      : unit === "minutes"
                      ? "Min"
                      : "Seg"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/lista">
              <Button size="lg" className="w-full sm:w-auto">
                <Gift className="mr-2 h-5 w-5" />
                Ver Lista de Presentes
              </Button>
            </Link>
            <Link href="/minhas-reservas">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Consultar Minhas Reservas
              </Button>
            </Link>
          </div>

          {/* Admin Link */}
          <div className="mt-8">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Gift className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Escolha seu Presente</h3>
            <p className="text-sm text-muted-foreground">
              Navegue pela nossa lista e escolha o presente perfeito
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Heart className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Reserve Online</h3>
            <p className="text-sm text-muted-foreground">
              Reserve seu presente de forma rápida e fácil
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Home className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Ajude a Construir</h3>
            <p className="text-sm text-muted-foreground">
              Faça parte da construção do nosso primeiro lar
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/50 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Feito com <Heart className="inline h-4 w-4 text-rose-500" /> para nosso Chá de Casa Nova
        </p>
      </footer>
    </div>
  );
}
