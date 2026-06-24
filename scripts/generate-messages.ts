/**
 * Lê o backup local e gera src/data/messages.json com os recados recebidos.
 * Mantém apenas reservas que têm mensagem, assinadas com o nome do convidado
 * e o presente correspondente. Ordena da mais antiga para a mais recente.
 *
 * Uso: bun run scripts/generate-messages.ts
 */
import { mkdir } from "node:fs/promises";

type Reservation = {
  guest_name: string;
  message: string | null;
  product_id: string;
  created_at: string;
};
type Product = { id: string; name: string };

const reservations: Reservation[] = await Bun.file(
  "backup/reservations.json"
).json();
const products: Product[] = await Bun.file("backup/products.json").json();
const productName = Object.fromEntries(products.map((p) => [p.id, p.name]));

const messages = reservations
  .filter((r) => r.message && r.message.trim().length > 0)
  .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
  .map((r) => ({
    name: r.guest_name.trim(),
    message: r.message!.trim(),
    gift: productName[r.product_id] ?? null,
    date: r.created_at,
  }));

await mkdir("src/data", { recursive: true });
await Bun.write("src/data/messages.json", JSON.stringify(messages, null, 2));

console.log(`✓ ${messages.length} mensagens salvas em src/data/messages.json`);
