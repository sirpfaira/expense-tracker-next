import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import {
  Transaction,
  sanitizeTransaction,
  dbTransactionSchema,
} from "@/lib/models/transaction";
import z from "zod";
import { AccountCurrency } from "@/lib/models/account";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const transactions = await db
      .collection<Transaction>("transactions")
      .find()
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
    const data = dbTransactionSchema.parse(body);

    const db = await getDatabase();

    const transaction: Transaction = {
      username: user.username,
      type: data.type,
      account: data.account,
      currency: data.currency as AccountCurrency,
      category: data.category,
      amount: data.amount,
      description: data.description.trim(),
      date: new Date(data.date),
    };

    const result = await db
      .collection<Transaction>("transactions")
      .insertOne(transaction);

    transaction._id = result.insertedId;

    // Reduce or increase account balances
    if (data.type === "income") {
      await db
        .collection("accounts")
        .updateOne(
          { shortCode: data.account },
          { $inc: { balance: data.amount } },
        );
    } else {
      await db
        .collection("accounts")
        .updateOne(
          { shortCode: data.account },
          { $inc: { balance: data.amount * -1 } },
        );
    }

    return NextResponse.json(
      { transaction: sanitizeTransaction(transaction) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create transaction error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 },
    );
  }
}
