import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_SETTINGS = {
  id: "main" as const,
  eventDate: new Date("2026-03-29"),
  fundraisingGoal: "15000",
  pixKey: null,
  pixName: null,
  pixCity: null,
  anonymousMode: true,
  updatedAt: new Date(),
};

export async function GET() {
  try {
    let result = await db.query.settings.findFirst({
      where: eq(settings.id, "main"),
    });

    if (!result) {
      const [created] = await db
        .insert(settings)
        .values(DEFAULT_SETTINGS)
        .returning();
      result = created;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    // Tenta atualizar, se não existir, cria
    const existing = await db.query.settings.findFirst({
      where: eq(settings.id, "main"),
    });

    let result;
    if (existing) {
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (body.eventDate) updateData.eventDate = new Date(body.eventDate);
      if (body.fundraisingGoal !== undefined) updateData.fundraisingGoal = body.fundraisingGoal.toString();
      if (body.pixKey !== undefined) updateData.pixKey = body.pixKey;
      if (body.pixName !== undefined) updateData.pixName = body.pixName;
      if (body.pixCity !== undefined) updateData.pixCity = body.pixCity;
      if (body.anonymousMode !== undefined) updateData.anonymousMode = body.anonymousMode;

      [result] = await db
        .update(settings)
        .set(updateData)
        .where(eq(settings.id, "main"))
        .returning();
    } else {
      [result] = await db
        .insert(settings)
        .values({
          ...DEFAULT_SETTINGS,
          eventDate: body.eventDate ? new Date(body.eventDate) : DEFAULT_SETTINGS.eventDate,
          fundraisingGoal: body.fundraisingGoal?.toString() || DEFAULT_SETTINGS.fundraisingGoal,
          pixKey: body.pixKey ?? DEFAULT_SETTINGS.pixKey,
          pixName: body.pixName ?? DEFAULT_SETTINGS.pixName,
          pixCity: body.pixCity ?? DEFAULT_SETTINGS.pixCity,
          anonymousMode: body.anonymousMode ?? DEFAULT_SETTINGS.anonymousMode,
        })
        .returning();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar configurações" },
      { status: 500 }
    );
  }
}
