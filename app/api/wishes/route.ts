import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Wish, wishSchema, sanitizeWish } from "@/lib/models/wish";
import { z } from "zod";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const wishes = await db.collection<Wish>("wishes").find().toArray();

    return NextResponse.json({
      wishes: wishes.map(sanitizeWish),
    });
  } catch (error) {
    console.error("Get wishes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishes" },
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
    const data = wishSchema.parse(body);
    const db = await getDatabase();
    const result = await db.collection<Wish>("wishes").insertOne(data);
    return NextResponse.json(
      { wish: sanitizeWish({ ...data, _id: result.insertedId }) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create wish error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return NextResponse.json(
      { error: "Failed to create wish" },
      { status: 500 },
    );
  }
}
