import { requireAuth } from "@/lib/auth";
import { currencySchema } from "@/lib/models/summary";
import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import z from "zod";
import { User } from "@/lib/models/user";
import { ObjectId } from "mongodb";

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const data = currencySchema.parse(body);
    const db = await getDatabase();

    const result = await db.collection<User>("users").findOneAndUpdate(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          currency: data.currency,
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Currency updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
