import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { User, sanitizeUser } from "@/lib/models/user";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { name, email, password } = validation.data;

    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const now = new Date();

    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    const user: User = {
      _id: result.insertedId,
      name,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    // Create and set auth token
    const token = await createToken(result.insertedId.toString());
    await setAuthCookie(token);

    return NextResponse.json(
      { user: sanitizeUser(user), message: "Registration successful" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
