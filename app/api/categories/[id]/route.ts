import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { requireAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";
import { Category, sanitizeCategory } from "@/lib/models/category";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const category = await db.collection<Category>("categories").findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category: sanitizeCategory(category) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get category error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const { name, type, icon, color } = body;

    if (!name || !type || !icon || !color) {
      return NextResponse.json(
        { error: "Name, type, icon, and color are required" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    // Check if category exists and belongs to user
    const existingCategory = await db
      .collection<Category>("categories")
      .findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user.id),
      });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const result = await db.collection<Category>("categories").findOneAndUpdate(
      { _id: new ObjectId(id), userId: new ObjectId(user.id) },
      {
        $set: {
          name: name.trim(),
          type,
          icon,
          color,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category: sanitizeCategory(result) });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update category error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const result = await db.collection<Category>("categories").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(user.id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Delete category error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
