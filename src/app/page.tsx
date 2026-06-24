"use client";

import { useEffect, useState } from "react";
import { Heart, Home, Gift, Quote } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import messages from "@/data/messages.json";

// O grande dia (Chá de Casa Nova de Henrique & Yasmim)
const EVENT_DATE = new Date(2026, 2, 29, 12, 0, 0); // 29 de março de 2026

function formatEventDate() {
  return EVENT_DATE.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HomePage() {
  const [daysSince, setDaysSince] = useState(0);

  useEffect(() => {
    const diff = Date.now() - EVENT_DATE.getTime();
    setDaysSince(Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Hero */}
      <section className="container mx-auto flex min-h-[85vh] flex-col items-center justify-center px-4 py-16 text-center">
        <FadeIn delay={0.1}>
          <motion.div
            className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
          <p className="mb-8 max-w-2xl text-xl text-muted-foreground md:text-2xl">
            Nossa jornada juntos começou na Quinta das Alamedas — e você fez
            parte desse sonho ❤️
          </p>
        </FadeIn>

        {/* Marco do evento (já aconteceu) */}
        <FadeIn delay={0.4}>
          <motion.div
            className="mb-6 inline-flex flex-col items-center gap-1 rounded-2xl border bg-card px-8 py-5 shadow-lg"
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Aconteceu em
            </span>
            <span className="text-2xl font-bold capitalize text-foreground md:text-3xl">
              {formatEventDate()}
            </span>
            {daysSince > 0 && (
              <span className="mt-1 text-sm text-muted-foreground">
                há {daysSince} {daysSince === 1 ? "dia" : "dias"} — e a gratidão
                continua
              </span>
            )}
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.6}>
          <p className="max-w-xl text-base text-muted-foreground">
            O grande dia já passou, mas guardamos esse cantinho com carinho para
            sempre lembrar de quem caminhou com a gente. Abaixo estão os recados
            que recebemos 💌
          </p>
        </FadeIn>

        <FadeIn delay={0.8}>
          <motion.div
            className="mt-8 text-primary"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-7 w-7 fill-primary" />
          </motion.div>
        </FadeIn>
      </section>

      {/* Mural de mensagens */}
      <section className="container mx-auto px-4 pb-24">
        <FadeIn>
          <h2 className="mb-2 text-center text-3xl font-bold text-primary md:text-4xl">
            Mensagens que recebemos
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            {messages.length} recados cheios de amor 💛
          </p>
        </FadeIn>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {messages.map((m, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-md transition-shadow hover:shadow-xl"
            >
              <Quote className="mb-3 h-6 w-6 shrink-0 text-primary/40" />
              <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
                {m.message}
              </p>
              <div className="mt-5 border-t pt-4">
                <p className="font-semibold text-primary">{m.name}</p>
                {m.gift && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Gift className="h-3 w-3" />
                    {m.gift}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t bg-background/50 py-8 text-center backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          Feito com{" "}
          <Heart className="inline h-4 w-4 fill-primary text-primary" /> por
          Henrique &amp; Yasmim
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Nosso cantinho na Quinta das Alamedas — para lembrar sempre
        </p>
      </footer>
    </div>
  );
}
