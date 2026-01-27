import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Budget, sanitizeBudget } from "@/lib/models/budget";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const budget = await db.collection<Budget>("budgets").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const { name, amount, period, categoryId, startDate, isActive } = body;

    if (!name || !amount || !period) {
      return NextResponse.json(
        { error: "Name, amount, and period are required" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const existingBudget = await db.collection<Budget>("budgets").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    });

    if (!existingBudget) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const result = await db.collection<Budget>("budgets").findOneAndUpdate(
      { _id: new ObjectId(id), userId: new ObjectId(user.id) },
      {
        $set: {
          name: name.trim(),
          amount: Number(amount),
          period,
          categoryId: categoryId ? new ObjectId(categoryId) : null,
          startDate: startDate ? new Date(startDate) : existingBudget.startDate,
          isActive: isActive !== undefined ? isActive : existingBudget.isActive,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ budget: sanitizeBudget(result) });
  } catch (error) {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid budget ID" }, { status: 400 });
    }

    const db = await getDatabase();

    const result = await db.collection<Budget>("budgets").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Budget deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete budget error:", error);
    return NextResponse.json(
      { error: "Failed to delete budget" },
      { status: 500 },
    );
  }
}
