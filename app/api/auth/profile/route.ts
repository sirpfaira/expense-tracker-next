import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth, verifyPassword } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { User, sanitizeUser } from "@/lib/models/user";

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const result = await db.collection<User>("users").findOneAndUpdate(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          name: name.trim(),
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
      db.collection<User>("users").deleteOne({ _id: new ObjectId(user.id) }),
    ]);

    return NextResponse.json({ message: "User account deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete user account" },
      { status: 500 },
    );
  }
}
