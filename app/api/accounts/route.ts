import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import {
  Account,
  AccountCurrency,
  accountSchema,
  sanitizeAccount,
  transferSchema,
} from "@/lib/models/account";
import { z } from "zod";
import { Transaction } from "@/lib/models/transaction";
import { ObjectId } from "mongodb";
import { Rate, RateResponse, sanitizeRate } from "@/lib/models/summary";
import { fetchCurrentRates } from "../rates/route";
import { convertAmount } from "@/lib/utils";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const accounts = await db.collection<Account>("accounts").find().toArray();

    return NextResponse.json({
      accounts: accounts.map(sanitizeAccount),
    });
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
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
    const data = accountSchema.parse(body);
    const db = await getDatabase();
    const result = await db.collection<Account>("accounts").insertOne(data);
    return NextResponse.json(
      { account: sanitizeAccount({ ...data, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create account error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const data = transferSchema.parse(body);
    const db = await getDatabase();
    const accounts = await db.collection<Account>("accounts").find().toArray();

    const toCurrency = accounts.find(
      (account) => account.shortCode === data.to,
    );

    if (!toCurrency) throw new Error("To account currency not found");

    let toAmount = data.amount;

    if (toCurrency.currency !== data.currency) {
      const dbRates = await db.collection<Rate>("rates").find().toArray();
      const rates = dbRates.map(sanitizeRate);

      let rate: RateResponse | null = null;

      if (rates.length === 0) {
        const newRate = await fetchCurrentRates();
        if (!newRate) {
          throw new Error("Failed to fetch rates");
        }
        rate = sanitizeRate(newRate);
      } else {
        rate = rates[0];
      }
      toAmount = convertAmount(
        data.amount,
        data.currency,
        toCurrency.currency,
        rate,
      );
    }

    // Reduce or increase account balances

    await db
      .collection("accounts")
      .updateOne({ shortCode: data.to }, { $inc: { balance: toAmount } });

    await db
      .collection("accounts")
      .updateOne(
        { shortCode: data.from },
        { $inc: { balance: data.amount * -1 } },
      );

    const transactions: Transaction[] = [
      {
        username: user.username,
        type: "transfer",
        account: data.to,
        currency: toCurrency.currency as AccountCurrency,
        category: "transfer",
        amount: Number(toAmount.toFixed(2)),
        description: "Inter account transfer",
        date: new Date(data.date),
      },
      {
        username: user.username,
        type: "transfer",
        account: data.from,
        currency: data.currency as AccountCurrency,
        category: "transfer",
        amount: data.amount,
        description: "Inter account transfer",
        date: new Date(data.date),
      },
    ];

    await db.collection<Transaction>("transactions").insertMany(transactions);

    return NextResponse.json(
      { message: "Account transfer successful" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create account error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
