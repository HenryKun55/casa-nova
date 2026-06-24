/**
 * Backup completo do banco Neon -> arquivos locais.
 *
 * Gera, dentro de ./backup:
 *   - <tabela>.json            (uma cópia de cada tabela)
 *   - full-backup.json         (tudo junto, com metadados)
 *   - restore.sql              (INSERTs para restaurar em qualquer Postgres)
 *
 * Uso: bun run scripts/backup-db.ts
 */
import { neon } from "@neondatabase/serverless";
import { mkdir } from "node:fs/promises";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL não definido (.env)");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Ordem respeita dependências de FK (pais antes de filhos) para o restore.sql
const TABLES = [
  "users",
  "accounts",
  "sessions",
  "verification_tokens",
  "products",
  "reservations",
  "admin_credentials",
  "activity_log",
  "settings",
];

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (value instanceof Date) return `'${value.toISOString()}'`;
  // string e demais -> escapa aspas simples
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
  const outDir = `${process.cwd()}/backup`;
  await mkdir(outDir, { recursive: true });

  const full: Record<string, unknown[]> = {};
  const sqlLines: string[] = [
    "-- Backup do banco Chá de Casa Nova",
    `-- Gerado em ${new Date().toISOString()}`,
    "-- Restaure com: psql <DATABASE_URL> -f restore.sql",
    "BEGIN;",
    "",
  ];

  for (const table of TABLES) {
    let rows: Record<string, unknown>[] = [];
    try {
      rows = (await sql.query(`SELECT * FROM ${table}`)) as Record<
        string,
        unknown
      >[];
    } catch (err) {
      console.warn(`⚠️  Tabela "${table}" ignorada: ${(err as Error).message}`);
      continue;
    }

    full[table] = rows;
    await Bun.write(`${outDir}/${table}.json`, JSON.stringify(rows, null, 2));
    console.log(`✓ ${table}: ${rows.length} registro(s)`);

    if (rows.length > 0) {
      const cols = Object.keys(rows[0]);
      sqlLines.push(`-- ${table} (${rows.length})`);
      for (const row of rows) {
        const values = cols.map((c) => sqlLiteral(row[c])).join(", ");
        sqlLines.push(
          `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${values});`
        );
      }
      sqlLines.push("");
    }
  }

  sqlLines.push("COMMIT;");

  await Bun.write(
    `${outDir}/full-backup.json`,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), tables: full },
      null,
      2
    )
  );
  await Bun.write(`${outDir}/restore.sql`, sqlLines.join("\n"));

  console.log(`\n✅ Backup completo salvo em ${outDir}`);
}

main().catch((err) => {
  console.error("Falha no backup:", err);
  process.exit(1);
});
