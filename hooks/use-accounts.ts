"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AccountResponse, AccountFormValues } from "@/lib/models/account";

interface UpdateAccountInput extends AccountFormValues {
  id: string;
}

async function fetchAccounts(): Promise<AccountResponse[]> {
  const res = await fetch("/api/accounts");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch accounts!");
  }
  const data = await res.json();
  return data.accounts;
}

async function createAccount(
  input: AccountFormValues,
): Promise<AccountResponse> {
  const res = await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create account!");
  }
  const data = await res.json();
  return data.account;
}

async function updateAccount(
  input: UpdateAccountInput,
): Promise<AccountResponse> {
  const { id, ...rest } = input;
  const res = await fetch(`/api/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update account!");
  }
  const data = await res.json();
  return data.account;
}

async function deleteAccount(id: string): Promise<void> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete account");
  }
}

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
