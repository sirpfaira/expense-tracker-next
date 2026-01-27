import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import {
  Budget,
  sanitizeBudget,
  getPeriodDateRange,
  BudgetWithSpending,
} from "@/lib/models/budget";
import { Transaction } from "@/lib/models/transaction";

export async function GET() {
  try {
    const user = await requireAuth();
    const db = await getDatabase();

    const budgets = await db
      .collection<Budget>("budgets")
      .find({ userId: new ObjectId(user.id), isActive: true })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate spending for each budget
    const budgetsWithSpending: BudgetWithSpending[] = await Promise.all(
      budgets.map(async (budget) => {
        const { start, end } = getPeriodDateRange(
          budget.period,
          budget.startDate,
        );

        const matchQuery: Record<string, unknown> = {
          userId: new ObjectId(user.id),
          type: "expense",
          date: { $gte: start, $lt: end },
        };

        if (budget.categoryId) {
          matchQuery.categoryId = budget.categoryId;
        }

        const result = await db
          .collection<Transaction>("transactions")
          .aggregate([
            { $match: matchQuery },
            { $group: { _id: null, total: { $sum: "$amount" } } },
          ])
          .toArray();

        const spent = result[0]?.total || 0;
        const remaining = Math.max(0, budget.amount - spent);
        const percentage = Math.min(100, (spent / budget.amount) * 100);

        return {
          ...sanitizeBudget(budget),
          spent,
          remaining,
          percentage,
        };
      }),
    );

    return NextResponse.json({ budgets: budgetsWithSpending });
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
    const user = await requireAuth();
    const body = await request.json();

    const { name, amount, period, categoryId, startDate } = body;

    if (!name || !amount || !period) {
      return NextResponse.json(
        { error: "Name, amount, and period are required" },
        { status: 400 },
      );
    }

    if (!["weekly", "monthly", "yearly"].includes(period)) {
      return NextResponse.json(
        { error: "Period must be weekly, monthly, or yearly" },
        { status: 400 },
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const now = new Date();

    const budget: Budget = {
      userId: new ObjectId(user.id),
      categoryId: categoryId ? new ObjectId(categoryId) : null,
      name: name.trim(),
      amount: Number(amount),
      period,
      startDate: startDate ? new Date(startDate) : now,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection<Budget>("budgets").insertOne(budget);
    budget._id = result.insertedId;

    return NextResponse.json(
      { budget: sanitizeBudget(budget) },
      { status: 201 },
    );
  } catch (error) {
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
