import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth, hashPassword, verifyPassword } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { User } from "@/lib/models/user";

export async function PUT(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    // Get current user with password
    const dbUser = await db.collection<User>("users").findOne({
      _id: new ObjectId(user.id),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      currentPassword,
      dbUser.password,
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);

    await db.collection<User>("users").updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          password: hashedPassword,
        },
      },
    );

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update password error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 },
    );
  }
}
