import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Wish, wishSchema, sanitizeWish } from "@/lib/models/wish";
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
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const wish = await db.collection<Wish>("wishes").findOne({
      _id: new ObjectId(id),
    });

    if (!wish) {
      return NextResponse.json({ error: "Wish not found!" }, { status: 404 });
    }

    return NextResponse.json({ wish: sanitizeWish(wish) });
  } catch (error) {
    console.error("Get wish error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wish" },
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
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 });
    }

    const body = await request.json();
    const data = wishSchema.parse(body);

    const db = await getDatabase();

    const result = await db.collection<Wish>("wishes").findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "Wish not found" }, { status: 404 });
    }

    return NextResponse.json({ wish: sanitizeWish(result) });
  } catch (error) {
    console.error("Update wish error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to update wish" },
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
      return NextResponse.json({ error: "Invalid wish ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const wish = await db.collection<Wish>("wishes").findOne({
      _id: new ObjectId(id),
    });
    if (wish) {
      await db.collection<Wish>("wishes").deleteOne({
        _id: new ObjectId(id),
      });

      return NextResponse.json({ message: "Wish deleted successfully" });
    } else {
      return NextResponse.json({ error: "Wish not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Delete wish error:", error);
    return NextResponse.json(
      { error: "Failed to delete wish" },
      { status: 500 },
    );
  }
}
