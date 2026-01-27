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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const transaction = await db
      .collection<Transaction>("transactions")
      .findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user.id),
      });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ transaction: sanitizeTransaction(transaction) });
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
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

    const result = await db
      .collection<Transaction>("transactions")
      .findOneAndUpdate(
        {
          _id: new ObjectId(id),
          userId: new ObjectId(user.id),
        },
        {
          $set: {
            type,
            category,
            amount,
            description: description.trim(),
            date: new Date(date),
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ transaction: sanitizeTransaction(result) });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json(
      { error: "Failed to update transaction" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const result = await db.collection<Transaction>("transactions").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
