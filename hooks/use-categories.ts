"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CategoryResponse, CategoryType } from "@/lib/models/category";

interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

interface UpdateCategoryInput extends CreateCategoryInput {
  id: string;
}

async function fetchCategories(): Promise<CategoryResponse[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch categories");
  }
  const data = await res.json();
  return data.categories;
}

async function createCategory(
  input: CreateCategoryInput,
): Promise<CategoryResponse> {
  const res = await fetch("/api/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create category");
  }
  const data = await res.json();
  return data.category;
}

async function updateCategory(
  input: UpdateCategoryInput,
): Promise<CategoryResponse> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update category");
  }
  const data = await res.json();
  return data.category;
}

async function deleteCategory(id: string): Promise<void> {
  const res = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete category");
  }
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
