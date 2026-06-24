"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { FloatingMessages } from "@/components/floating-messages";
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
    <div className="relative h-[100svh] w-full overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950">
      <div className="absolute right-4 top-4 z-[110]">
        <ThemeToggle />
      </div>

      {/* Campo de mensagens flutuantes */}
      <FloatingMessages messages={messages} />

      {/* Véu suave no topo para o cabeçalho ficar legível sobre os recados */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[42%] bg-gradient-to-b from-amber-50 via-amber-50/80 to-transparent dark:from-stone-950 dark:via-stone-950/80" />

      {/* Cabeçalho sobreposto (não bloqueia o hover dos recados) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-10 text-center sm:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-primary md:text-6xl"
        >
          Chá de Casa Nova
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base"
        >
          Henrique &amp; Yasmim — Quinta das Alamedas
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 inline-flex flex-col items-center rounded-2xl border bg-card/80 px-6 py-3 shadow-sm backdrop-blur-sm"
        >
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Aconteceu em
          </span>
          <span className="text-lg font-bold capitalize text-foreground md:text-xl">
            {formatEventDate()}
          </span>
          {daysSince > 0 && (
            <span className="text-xs text-muted-foreground">
              há {daysSince} {daysSince === 1 ? "dia" : "dias"} — e a gratidão
              continua 💛
            </span>
          )}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          <span className="hidden sm:inline">
            Passe o mouse sobre um recado para lê-lo
          </span>
          <span className="sm:hidden">
            Toque num recado para ler · toque fora para fechar
          </span>
        </motion.p>
      </div>

      {/* Rodapé sobreposto na base */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex flex-col items-center gap-0.5 bg-gradient-to-t from-amber-50 via-amber-50/70 to-transparent px-4 pb-5 pt-10 text-center dark:from-stone-950 dark:via-stone-950/70">
        <p className="text-xs text-muted-foreground">
          {messages.length} recados que guardamos com carinho
        </p>
        <p className="text-xs text-muted-foreground">
          Feito com{" "}
          <Heart className="inline h-3 w-3 fill-primary text-primary" /> por
          Henrique &amp; Yasmim
        </p>
      </div>
    </div>
  );
}
