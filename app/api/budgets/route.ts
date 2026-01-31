import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { Budget, budgetSchema, sanitizeBudget } from "@/lib/models/budget";
import z from "zod";

export async function GET() {
  try {
    const user = await requireAuth();
    const db = await getDatabase();
    const budgets = await db
      .collection<Budget>("budgets")
      .find()
      .sort({
        period: -1,
      })
      .toArray();
    return NextResponse.json({ budgets: budgets.map(sanitizeBudget) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get budgets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const data = budgetSchema.parse(body);

    const db = await getDatabase();
    const result = await db.collection<Budget>("budgets").insertOne(data);
    return NextResponse.json(
      { budget: sanitizeBudget({ ...data, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create budget error:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 },
    );
  }
}
