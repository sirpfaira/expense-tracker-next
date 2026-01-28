import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import {
  Category,
  sanitizeCategory,
  DEFAULT_CATEGORIES,
} from "@/lib/models/category";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const db = await getDatabase();

    const categories = await db
      .collection<Category>("categories")
      .find()
      .sort({ type: 1, name: 1 })
      .toArray();

    // If user has no categories, create default ones
    if (categories.length === 0) {
      await db
        .collection<Category>("categories")
        .insertMany(DEFAULT_CATEGORIES);

      const newCategories = await db
        .collection<Category>("categories")
        .find()
        .sort({ type: 1, name: 1 })
        .toArray();

      return NextResponse.json({
        categories: newCategories.map(sanitizeCategory),
      });
    }

    return NextResponse.json({
      categories: categories.map(sanitizeCategory),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();

    const { name, type, icon, color } = body;

    if (!name || !type || !icon || !color) {
      return NextResponse.json(
        { error: "Name, type, icon, and color are required" },
        { status: 400 },
      );
    }

    if (!["income", "expense"].includes(type)) {
      return NextResponse.json(
        { error: "Type must be income or expense" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const category: Category = {
      name: name.trim(),
      type,
      icon,
      color,
      isDefault: false,
    };

    const result = await db
      .collection<Category>("categories")
      .insertOne(category);
    category._id = result.insertedId;

    return NextResponse.json(
      { category: sanitizeCategory(category) },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
