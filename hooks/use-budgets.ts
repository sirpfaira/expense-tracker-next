"use client";

import {
  BudgetExpenseFormValues,
  BudgetResponse,
  DeleteBudgetInput,
} from "@/lib/models/budget";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function fetchBudgets(): Promise<BudgetResponse[]> {
  const res = await fetch("/api/budgets");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch budgets");
  }
  const data = await res.json();
  return data.budgets;
}

async function addBudgetExpense(
  input: BudgetExpenseFormValues,
): Promise<BudgetResponse> {
  const res = await fetch("/api/budgets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create budget");
  }
  const data = await res.json();
  return data.budget;
}

async function deleteBudgetExpense(input: DeleteBudgetInput): Promise<void> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/budgets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete budget");
  }
}

export function useBudgets() {
  return useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });
}

export function useAddBudgetExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBudgetExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useDeleteBudgetExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudgetExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
