"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Gift, Heart, Home, Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCounter } from "@/components/ui/animated-counter";

export default function HomePage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [eventDate, setEventDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        // Extrai apenas YYYY-MM-DD e cria data no timezone local (evita problema de UTC)
        const dateStr = data.eventDate.split("T")[0];
        const [year, month, day] = dateStr.split("-").map(Number);
        setEventDate(new Date(year, month - 1, day, 12, 0, 0));
      })
      .catch(() => {
        setEventDate(new Date(2026, 2, 29, 12, 0, 0));
      });
  }, []);

  useEffect(() => {
    if (!eventDate) return;

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
  }, [eventDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <section className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <FadeIn delay={0.1}>
            <motion.div
              className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Home className="h-12 w-12" />
            </motion.div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="mb-4 text-5xl font-bold text-primary md:text-7xl">
              Chá de Casa Nova
            </h1>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Estamos começando nossa jornada juntos na Quinta das Alamedas e você faz parte desse sonho ❤️
            </p>
          </FadeIn>

          {/* Data do Evento */}
          {eventDate && (
            <FadeIn delay={0.4}>
              <motion.div
                className="mb-8 inline-flex items-center gap-4 rounded-2xl bg-card px-8 py-5 border shadow-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center justify-center rounded-xl bg-primary/10 px-4 py-3 min-w-[70px]">
                  <span className="text-xs font-bold uppercase text-primary">
                    {eventDate.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                  </span>
                  <span className="text-3xl font-bold text-primary">
                    {eventDate.getDate()}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Salve a Data
                  </p>
                  <p className="text-xl font-bold text-foreground md:text-2xl capitalize">
                    {eventDate.toLocaleDateString("pt-BR", { weekday: "long" })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {eventDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </motion.div>
            </FadeIn>
          )}

          {/* Countdown */}
          <FadeIn delay={0.5}>
            <div className="mb-12">
              <p className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Contagem Regressiva
              </p>
              <div className="flex justify-center gap-4">
                {Object.entries(timeLeft).map(([unit, value], index) => (
                  <motion.div
                    key={unit}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex flex-col items-center rounded-lg bg-card border p-4 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <AnimatedCounter value={value} className="text-3xl font-bold text-primary md:text-4xl" />
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {unit === "days"
                        ? "Dias"
                        : unit === "hours"
                        ? "Horas"
                        : unit === "minutes"
                        ? "Min"
                        : "Seg"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.9}>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/list">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Gift className="mr-2 h-5 w-5" />
                    Ver Nossos Sonhos
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/my-reservations">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    <Search className="mr-2 h-5 w-5" />
                    Minhas Contribuições
                  </Button>
                </Link>
              </motion.div>
            </div>
          </FadeIn>

          {/* Admin Link */}
          <FadeIn delay={1}>
            <div className="mt-8">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:scale-105 transition-transform">
                  Área Administrativa
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          {[
            { icon: Gift, title: "Escolha com Carinho", desc: "Veja o que precisamos para começar nossa vida juntos", delay: 1.1 },
            { icon: Heart, title: "Contribua com Amor", desc: "Sua ajuda faz toda diferença no nosso começo", delay: 1.2 },
            { icon: Home, title: "Construa Conosco", desc: "Cada presente é um tijolo no nosso lar", delay: 1.3 }
          ].map((item) => (
            <FadeIn key={item.title} delay={item.delay}>
              <motion.div
                className="text-center"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20"
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <footer className="border-t bg-background/50 backdrop-blur-sm py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Feito com <Heart className="inline h-4 w-4 text-primary fill-primary" /> por Henrique & Yasmim
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Nosso cantinho na Quinta das Alamedas
        </p>
      </footer>
    </div>
  );
}
