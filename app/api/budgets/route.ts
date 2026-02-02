import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import {
  Budget,
  budgetExpenseSchema,
  sanitizeBudget,
} from "@/lib/models/budget";
import z from "zod";

export async function GET() {
  try {
    await requireAuth();
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
    const data = budgetExpenseSchema.parse(body);

    const db = await getDatabase();
    const existingBudget = await db.collection<Budget>("budgets").findOne({
      period: data.period,
    });
    if (existingBudget) {
      const existingExpense = existingBudget.expenses.find(
        (expense) => expense.category === data.category,
      );
      if (existingExpense) {
        await db.collection<Budget>("budgets").findOneAndUpdate(
          {
            _id: existingBudget._id,
            "expenses._id": existingExpense._id,
          },
          {
            $set: {
              "expenses.$.amount": data.amount,
              "expenses.$.currency": data.currency,
              "expenses.$.description": data.description,
            },
          },
          { returnDocument: "after" },
        );
        return NextResponse.json(
          { budget: sanitizeBudget(existingBudget) },
          { status: 201 },
        );
      } else {
        await db.collection<Budget>("budgets").findOneAndUpdate(
          { _id: existingBudget._id },
          {
            $set: {
              expenses: [
                ...existingBudget.expenses,
                {
                  category: data.category,
                  amount: data.amount,
                  currency: data.currency,
                  description: data.description,
                },
              ],
            },
          },
          { returnDocument: "after" },
        );
        return NextResponse.json(
          { budget: sanitizeBudget(existingBudget) },
          { status: 201 },
        );
      }
    } else {
      const budget: Budget = {
        period: data.period,
        expenses: [
          {
            category: data.category,
            amount: data.amount,
            currency: data.currency,
            description: data.description,
          },
        ],
      };
      const result = await db.collection<Budget>("budgets").insertOne(budget);
      return NextResponse.json(
        { budget: sanitizeBudget({ ...budget, _id: result.insertedId }) },
        { status: 201 },
      );
    }
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
