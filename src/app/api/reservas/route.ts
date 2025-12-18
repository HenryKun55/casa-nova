import { NextResponse } from "next/server";
import { db } from "@/db";
import { produtos, reservas } from "@/db/schema";
import { createReservaSchema } from "@/lib/validations/reserva";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

// POST /api/reservas - Criar reserva (público)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createReservaSchema.parse(body);

    // Verificar se produto existe e não está reservado
    const produto = await db.query.produtos.findFirst({
      where: eq(produtos.id, validated.produtoId),
      with: { reserva: true },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (produto.reserva) {
      return NextResponse.json(
        { error: "Produto já reservado" },
        { status: 400 }
      );
    }

    const [novaReserva] = await db
      .insert(reservas)
      .values(validated)
      .returning();

    return NextResponse.json(novaReserva, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    );
  }
}

// GET /api/reservas - Listar todas as reservas (admin only via middleware ou check aqui)
export async function GET() {
  try {
    const result = await db.query.reservas.findMany({
      with: {
        produto: true,
      },
      orderBy: (reservas, { desc }) => [desc(reservas.createdAt)],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar reservas" },
      { status: 500 }
    );
  }
}
