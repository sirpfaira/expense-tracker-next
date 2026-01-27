"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BudgetWithSpending, BudgetPeriod } from "@/lib/models/budget";

interface CreateBudgetInput {
  name: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: string | null;
  startDate?: string;
}

interface UpdateBudgetInput extends CreateBudgetInput {
  id: string;
  isActive?: boolean;
}

async function fetchBudgets(): Promise<BudgetWithSpending[]> {
  const res = await fetch("/api/budgets");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch budgets");
  }
  const data = await res.json();
  return data.budgets;
}

async function createBudget(
  input: CreateBudgetInput,
): Promise<BudgetWithSpending> {
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

async function updateBudget(
  input: UpdateBudgetInput,
): Promise<BudgetWithSpending> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/budgets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update budget");
  }
  const data = await res.json();
  return data.budget;
}

async function deleteBudget(id: string): Promise<void> {
  const res = await fetch(`/api/budgets/${id}`, {
    method: "DELETE",
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

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
  });
}
