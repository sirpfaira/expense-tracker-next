import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Account, accountSchema, sanitizeAccount } from "@/lib/models/account";
import { z } from "zod";

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
