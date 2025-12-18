import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, reservations } from "@/db/schema";
import { createReservationSchema } from "@/lib/validations/reservation";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createReservationSchema.parse(body);

    const product = await db.query.products.findFirst({
      where: eq(products.id, validated.productId),
      with: { reservation: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    if (product.reservation) {
      return NextResponse.json(
        { error: "Produto já reservado" },
        { status: 400 }
      );
    }

    const [newReservation] = await db
      .insert(reservations)
      .values(validated)
      .returning();

    return NextResponse.json(newReservation, { status: 201 });
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

export async function GET() {
  try {
    const result = await db.query.reservations.findMany({
      with: {
        product: true,
      },
      orderBy: (reservations, { desc }) => [desc(reservations.createdAt)],
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
