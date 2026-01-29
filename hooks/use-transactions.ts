"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TransactionInput,
  TransactionResponse,
} from "@/lib/models/transaction";

interface TransactionUpdate extends TransactionInput {
  id: string;
}

async function fetchTransactions(): Promise<TransactionResponse[]> {
  const res = await fetch("/api/transactions");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch transactions");
  }
  const data = await res.json();
  return data.transactions;
}

async function createTransaction(
  input: TransactionInput,
): Promise<TransactionResponse> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create transaction");
  }
  const data = await res.json();
  return data.transaction;
}

async function updateTransaction(
  input: TransactionUpdate,
): Promise<TransactionResponse> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/transactions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update transaction");
  }
  const data = await res.json();
  return data.transaction;
}

async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete transaction");
  }
}

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
