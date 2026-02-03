import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth";
import { User, registerSchema, sanitizeUser } from "@/lib/models/user";
import { InsertOneResult } from "mongodb";

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

    const { name, email, password, inviteCode } = validation.data;
    if (inviteCode !== process.env.INVITE_CODE) {
      return NextResponse.json(
        { error: "Invalid invitation code!" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const username = email.split("@")[0];
    const usersCollection = db.collection<User>("users");
    const existingUsername = await usersCollection.findOne({ username });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Check if collection is empty
    const count = await usersCollection.countDocuments({});
    const isEmpty = count === 0;
    let result: InsertOneResult<User>;

    if (isEmpty) {
      result = await usersCollection.insertOne({
        name,
        username,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "admin",
        currency: "usd",
      });
    } else {
      // Check if user already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 },
        );
      }

      result = await usersCollection.insertOne({
        name,
        username: existingUsername ? `${username}${count + 1}` : username,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "user",
        currency: "usd",
      });
    }

    const user: User = {
      _id: result.insertedId,
      name,
      username: existingUsername ? `${username}${count + 1}` : username,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: isEmpty ? "admin" : "user",
      currency: "usd",
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
