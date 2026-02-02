import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import {
  Budget,
  budgetExpenseSchema,
  sanitizeBudget,
} from "@/lib/models/budget";
import z from "zod";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const budget = await db.collection<Budget>("budgets").findOne({
      _id: new ObjectId(id),
    });

    if (!budget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ budget: sanitizeBudget(budget) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get budget error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }
    const body = await request.json();
    const data = budgetExpenseSchema.parse(body);

    const db = await getDatabase();

    const existingBudget = await db.collection<Budget>("budgets").findOne({
      _id: new ObjectId(id),
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }
    const expenses = existingBudget.expenses.filter(
      (expense) => expense.category !== data.category,
    );

    const result = await db.collection<Budget>("budgets").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          expenses: expenses,
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ budget: sanitizeBudget(result) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update budget error:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 },
    );
  }
}
