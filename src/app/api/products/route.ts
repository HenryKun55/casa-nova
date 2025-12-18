import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { createProductSchema } from "@/lib/validations/product";
import { desc } from "drizzle-orm";
import { ZodError } from "zod";

export async function GET() {
  try {
    const result = await db.query.products.findMany({
      with: {
        reservation: true,
      },
      orderBy: [desc(products.priority), desc(products.createdAt)],
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

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createProductSchema.parse(body);

    const [newProduct] = await db
      .insert(products)
      .values(validated)
      .returning();

    return NextResponse.json(newProduct, { status: 201 });
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
