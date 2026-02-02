"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WishResponse, WishFormValues } from "@/lib/models/wish";

interface UpdateWishInput extends WishFormValues {
  id: string;
}

async function fetchWishes(): Promise<WishResponse[]> {
  const res = await fetch("/api/wishes");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch wishes!");
  }
  const data = await res.json();
  return data.wishes;
}

async function createWish(input: WishFormValues): Promise<WishResponse> {
  const res = await fetch("/api/wishes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create wish!");
  }
  const data = await res.json();
  return data.wish;
}

async function updateWish(input: UpdateWishInput): Promise<WishResponse> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/wishes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update wish!");
  }
  const data = await res.json();
  return data.wish;
}

async function deleteWish(id: string): Promise<void> {
  const res = await fetch(`/api/wishes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete wish");
  }
}

export function useWishes() {
  return useQuery({
    queryKey: ["wishes"],
    queryFn: fetchWishes,
  });
}

export function useCreateWish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
}

export function useUpdateWish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
}

export function useDeleteWish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
  });
}
