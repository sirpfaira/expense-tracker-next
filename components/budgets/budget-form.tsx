"use client";

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
import { Loader2 } from "lucide-react";
import { ACCOUNT_CURRENCIES } from "@/lib/models/account";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BudgetExpenseFormValues,
  budgetExpenseSchema,
} from "@/lib/models/budget";
import { CategoryResponse } from "@/lib/models/category";
import { UserResponse } from "@/lib/models/user";

interface BudgetFormProps {
  budgetExpense: BudgetExpenseFormValues | null;
  categories: CategoryResponse[];
  user: UserResponse;
  onSubmit: (data: BudgetExpenseFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BudgetForm({
  budgetExpense,
  categories,
  user,
  onSubmit,
  onCancel,
  isLoading = false,
}: BudgetFormProps) {
  const form = useForm<BudgetExpenseFormValues>({
    resolver: zodResolver(budgetExpenseSchema),
    defaultValues: {
      period: budgetExpense?.period || new Date().toISOString().split("T")[0],
      category: budgetExpense?.category || "",
      amount: budgetExpense?.amount || 0,
      currency: user.currency || "usd",
      description: budgetExpense?.description || "",
    },
  });

  return (
    <form
      id="form-budget-expense"
      onSubmit={form.handleSubmit((data) => onSubmit(data))}
    >
      <FieldGroup>
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-budget-expense-category">
                Category
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-budget-expense-category"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.uid}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-budget-expense-amount">
                  Amount
                </FieldLabel>
                <Input
                  {...field}
                  id="form-budget-expense-amount"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  placeholder="0.00"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-budget-expense-currency">
                  Currency
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-budget-expense-currency"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {ACCOUNT_CURRENCIES.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </div>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-budget-expense-description">
                Description
              </FieldLabel>
              <Input
                {...field}
                id="form-budget-expense-description"
                aria-invalid={fieldState.invalid}
                placeholder="Rent"
                autoComplete="off"
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
          <Button type="submit" form="form-budget-expense" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {budgetExpense ? "Update" : "Create"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
