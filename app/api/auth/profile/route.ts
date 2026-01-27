import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth, verifyPassword } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { User, sanitizeUser } from "@/lib/models/user";

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    // Check if email is already taken by another user
    const existingUser = await db.collection<User>("users").findOne({
      email: email.toLowerCase(),
      _id: { $ne: new ObjectId(user.id) },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 400 },
      );
    }

    const result = await db.collection<User>("users").findOneAndUpdate(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: sanitizeUser(result) });
  } catch (error) {
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

export async function DELETE(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required to delete account" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    // Verify password
    const dbUser = await db.collection<User>("users").findOne({
      _id: new ObjectId(user.id),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isValidPassword = await verifyPassword(password, dbUser.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 },
      );
    }

    // Delete all user data
    await Promise.all([
      db
        .collection("transactions")
        .deleteMany({ userId: new ObjectId(user.id) }),
      db.collection("categories").deleteMany({ userId: new ObjectId(user.id) }),
      db.collection("budgets").deleteMany({ userId: new ObjectId(user.id) }),
      db.collection<User>("users").deleteOne({ _id: new ObjectId(user.id) }),
    ]);

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 },
    );
  }
}
