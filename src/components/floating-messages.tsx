"use client";

import { useEffect, useRef } from "react";
import { Gift, Quote } from "lucide-react";

type Message = {
  name: string;
  message: string;
  gift: string | null;
  date: string;
};

type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number; // rotação base (pilha bagunçada)
  curRot: number; // rotação atual (eased)
  scale: number; // valor atual (eased)
  opacity: number; // valor atual (eased)
};

// pequeno helper de aleatório centrado em 0
const spread = (n: number) => (Math.random() - 0.5) * 2 * n;

export function FloatingMessages({ messages }: { messages: Message[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const focusedRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const layout = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;

      bodiesRef.current = messages.map((_, i) => {
        const node = nodesRef.current[i];
        const w = node?.offsetWidth ?? 220;
        const h = node?.offsetHeight ?? 140;
        // espalha numa grade frouxa com jitter pra evitar empilhar tudo no mesmo ponto
        const cols = Math.max(1, Math.floor(W / (w * 0.7)));
        const rows = Math.ceil(messages.length / cols);
        const cellW = W / cols;
        const cellH = H / rows;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = Math.min(
          Math.max(0, col * cellW + (cellW - w) / 2 + spread(cellW * 0.25)),
          Math.max(0, W - w)
        );
        const y = Math.min(
          Math.max(0, row * cellH + (cellH - h) / 2 + spread(cellH * 0.25)),
          Math.max(0, H - h)
        );
        const speed = reduceMotion ? 0 : 0.12 + Math.random() * 0.22;
        const angle = Math.random() * Math.PI * 2;
        return {
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          w,
          h,
          rot: spread(7),
          curRot: spread(7),
          scale: 1,
          opacity: 0.55,
        };
      });
    };

    layout();

    const step = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const focused = focusedRef.current;
      const someoneFocused = focused !== null;

      bodiesRef.current.forEach((b, i) => {
        const node = nodesRef.current[i];
        if (!node) return;

        const isFocused = focused === i;

        // movimento contínuo (gravidade leve) — pausa só quem está em foco
        if (!isFocused && !reduceMotion) {
          b.x += b.vx;
          b.y += b.vy;
          // quica suave nas bordas, mantendo o card visível
          if (b.x <= 0) {
            b.x = 0;
            b.vx = Math.abs(b.vx);
          } else if (b.x >= W - b.w) {
            b.x = W - b.w;
            b.vx = -Math.abs(b.vx);
          }
          if (b.y <= 0) {
            b.y = 0;
            b.vy = Math.abs(b.vy);
          } else if (b.y >= H - b.h) {
            b.y = H - b.h;
            b.vy = -Math.abs(b.vy);
          }
        }

        // alvos de aparência
        const targetScale = isFocused ? 1.18 : 1;
        const targetOpacity = isFocused ? 1 : someoneFocused ? 0.28 : 0.55;
        const targetRot = isFocused ? 0 : b.rot;

        // easing suave
        b.scale += (targetScale - b.scale) * 0.12;
        b.opacity += (targetOpacity - b.opacity) * 0.12;
        b.curRot += (targetRot - b.curRot) * 0.12;

        // quando focado, "puxa" o card só o necessário pra caber inteiro na
        // tela (sem teleportar: se já cabe, o alvo é a própria posição)
        if (isFocused) {
          const fw = node.offsetWidth;
          const fh = node.offsetHeight; // já com a mensagem expandida (dvh)
          const halfW = (fw * b.scale) / 2;
          const halfH = (fh * b.scale) / 2;
          const pad = 12;
          let cx = b.x + fw / 2;
          let cy = b.y + fh / 2;
          const minCx = pad + halfW;
          const maxCx = W - pad - halfW;
          const minCy = pad + halfH;
          const maxCy = H - pad - halfH;
          cx = maxCx >= minCx ? Math.min(Math.max(cx, minCx), maxCx) : W / 2;
          cy = maxCy >= minCy ? Math.min(Math.max(cy, minCy), maxCy) : H / 2;
          b.x += (cx - fw / 2 - b.x) * 0.15;
          b.y += (cy - fh / 2 - b.y) * 0.15;
        }

        node.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.curRot}deg) scale(${b.scale})`;
        node.style.opacity = String(b.opacity);
        node.style.zIndex = String(isFocused ? 100 : 10 + i);
        node.classList.toggle("is-focused", isFocused);
      });

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [messages]);

  const focus = (i: number | null) => {
    focusedRef.current = i;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      // mouse: foco "fixo" — só sai quando o mouse deixa a área toda
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") focus(null);
      }}
      // toque no fundo (fora de um card) tira o foco
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") focus(null);
      }}
    >
      {messages.map((m, i) => (
        <div
          key={i}
          ref={(el) => {
            nodesRef.current[i] = el;
          }}
          // mouse: hover foca (o desfoque é tratado no container, p/ não tremer)
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") focus(i);
          }}
          // toque/caneta: tap foca/troca; se já focado, deixa rolar o texto
          onPointerDown={(e) => {
            if (e.pointerType !== "mouse") {
              e.stopPropagation();
              if (focusedRef.current !== i) focus(i);
            }
          }}
          style={{ opacity: 0, willChange: "transform, opacity" }}
          className="float-card absolute left-0 top-0 w-[200px] select-none rounded-2xl border bg-card/90 p-4 shadow-md backdrop-blur-sm transition-shadow duration-300 sm:w-[230px]"
        >
          <Quote className="mb-2 h-4 w-4 text-primary/40" />
          <p className="float-msg whitespace-pre-line text-[13px] leading-relaxed text-foreground">
            {m.message}
          </p>
          <div className="mt-3 border-t pt-2">
            <p className="text-sm font-semibold text-primary">{m.name}</p>
            {m.gift && (
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Gift className="h-3 w-3" />
                {m.gift}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
