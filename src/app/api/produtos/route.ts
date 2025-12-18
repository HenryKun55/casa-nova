import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { produtos } from "@/db/schema";
import { createProdutoSchema } from "@/lib/validations/produto";
import { desc } from "drizzle-orm";
import { ZodError } from "zod";

// GET /api/produtos - Listar todos com reservas
export async function GET() {
  try {
    const result = await db.query.produtos.findMany({
      with: {
        reserva: true,
      },
      orderBy: [desc(produtos.prioridade), desc(produtos.createdAt)],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

// POST /api/produtos - Criar produto (só admin)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createProdutoSchema.parse(body);

    const [novoProduto] = await db
      .insert(produtos)
      .values(validated)
      .returning();

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao criar produto:", error);
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}
