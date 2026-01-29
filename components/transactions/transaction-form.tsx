"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Loader2 } from "lucide-react";
import { AccountResponse, AccountCurrency } from "@/lib/models/account";
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
  const [currentCategories, setCurrentCategories] = useState<
    CategoryResponse[]
  >([]);
  const [currency, setCurrency] = useState<AccountCurrency>("usd");

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: transaction?.type || "expense",
      category: transaction?.category || "",
      account: transaction?.account || accounts?.[0]?.shortCode || "",
      amount: transaction?.amount || 0,
      description: transaction?.description || "",
      date: transaction?.date ? new Date(transaction.date) : new Date(),
    },
  });

  const typeValue = form.watch("type");
  const accountValue = form.watch("account");

  useEffect(() => {
    if (typeValue) {
      // Update secondary options based on the primary value
      const typeCategories = categories?.filter(
        (category) => category.type === typeValue,
      );

      setCurrentCategories(typeCategories || []);
      // Reset the value of the secondary select when the primary changes
      form.setValue("category", "");
    } else {
      setCurrentCategories([]);
    }
  }, [typeValue, form.setValue]);

  useEffect(() => {
    if (accountValue) {
      // Update currency based on account
      const account = accounts?.find((acc) => acc.shortCode === accountValue);
      setCurrency(account?.currency || "usd");
    } else {
      setCurrency("usd");
    }
  }, [accountValue, form.setValue]);

  const submitHandler = async (data: TransactionFormValues) => {
    const payload: TransactionInput = {
      type: data.type as TransactionType,
      category: data.category as string,
      account: data.account as string,
      currency: currency,
      amount: data.amount as number,
      description: data.description as string,
      date: data.date.toLocaleDateString("en-ZA"),
    };
    onSubmit(payload);
  };

  return (
    <form id="form-transaction" onSubmit={form.handleSubmit(submitHandler)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
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
                    {currentCategories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.uid}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
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
                <FieldLabel htmlFor="form-transaction-amount">
                  Amount
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="form-transaction-amount"
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="0.00"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>{currency.toUpperCase()}</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
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
