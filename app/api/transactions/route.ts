import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import {
  Transaction,
  sanitizeTransaction,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/models/transaction";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const transactions = await db
      .collection<Transaction>("transactions")
      .find({ userId: new ObjectId(user.id) })
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json({
      transactions: transactions.map(sanitizeTransaction),
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, category, amount, description, date } = body;

    // Validate required fields
    if (!type || !category || amount === undefined || !description || !date) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 },
      );
    }

    // Validate category based on type
    const validCategories =
      type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category for this transaction type" },
        { status: 400 },
      );
    }

    // Validate amount
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const now = new Date();

    const transaction: Transaction = {
      userId: new ObjectId(user.id),
      type,
      category,
      amount,
      description: description.trim(),
      date: new Date(date),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db
      .collection<Transaction>("transactions")
      .insertOne(transaction);

    transaction._id = result.insertedId;

    return NextResponse.json(
      { transaction: sanitizeTransaction(transaction) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create transaction error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
