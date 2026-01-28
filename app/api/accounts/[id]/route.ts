import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Account, accountSchema, sanitizeAccount } from "@/lib/models/account";
import z from "zod";

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
        { error: "Invalid account ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const account = await db.collection<Account>("accounts").findOne({
      _id: new ObjectId(id),
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json({ account: sanitizeAccount(account) });
  } catch (error) {
    console.error("Get account error:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
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
        { error: "Invalid account ID" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const data = accountSchema.parse(body);

    const db = await getDatabase();

    const result = await db.collection<Account>("accounts").findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ account: sanitizeAccount(result) });
  } catch (error) {
    console.error("Update account error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to update account" },
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
        { error: "Invalid account ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const account = await db.collection<Account>("accounts").findOne({
      _id: new ObjectId(id),
    });
    if (account) {
      await db.collection<Account>("accounts").deleteOne({
        _id: new ObjectId(id),
      });
      // Delete transactions of the account
      await db.collection("transactions").deleteMany({
        account: account.shortCode,
      });
      return NextResponse.json({ message: "Account deleted successfully" });
    } else {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
