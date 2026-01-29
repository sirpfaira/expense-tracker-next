"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  AccountResponse,
  AccountType,
  AccountCurrency,
  ACCOUNT_CURRENCIES,
  ACCOUNT_TYPES,
  AccountFormValues,
  accountSchema,
} from "@/lib/models/account";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionFormValues,
  TransactionInput,
  TransactionResponse,
  transactionSchema,
  TransactionType,
} from "@/lib/models/transaction";
import { CategoryResponse } from "@/lib/models/category";

interface TransactionFormProps {
  categories: CategoryResponse[] | undefined;
  accounts: AccountResponse[] | undefined;
  transaction?: TransactionResponse | null;
  onSubmit: (data: TransactionInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransactionForm({
  categories,
  accounts,
  transaction,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || "expense",
      category: transaction?.category || "",
      account: transaction?.account || "",
      amount: transaction?.amount || 0,
      description: transaction?.description || "",
      date: new Date(transaction?.date || "2026-02-01") || new Date(),
    },
  });

  const submitHandler = async (data: TransactionFormValues) => {
    console.log(data);
  };

  return (
    <form id="form-transaction" onSubmit={form.handleSubmit(submitHandler)}>
      <FieldGroup>
        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-type">Type</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-transaction-type"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-category">
                Category
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-transaction-category"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          name="account"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-account">
                Account
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-transaction-account"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {accounts?.map((acc) => (
                    <SelectItem key={acc.id} value={acc.shortCode}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Controller
          name="amount"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-amount">Amount</FieldLabel>
              <Input
                {...field}
                id="form-transaction-amount"
                aria-invalid={fieldState.invalid}
                placeholder="100.00"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-description">
                Description
              </FieldLabel>
              <Input
                {...field}
                id="form-transaction-description"
                aria-invalid={fieldState.invalid}
                placeholder="Rent"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-transaction-date">Date</FieldLabel>
              <Input
                {...field}
                id="form-transaction-date"
                type="date"
                aria-invalid={fieldState.invalid}
                value={
                  field.value instanceof Date
                    ? field.value.toISOString().split("T")[0]
                    : field.value
                }
                onChange={(e) => field.onChange(new Date(e.target.value))}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="form-transaction" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {transaction ? "Update" : "Create"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
