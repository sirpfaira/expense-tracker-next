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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Loader2 } from "lucide-react";
import { WishResponse, WishFormValues, wishSchema } from "@/lib/models/wish";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ACCOUNT_CURRENCIES } from "@/lib/models/account";
import { Switch } from "@/components/ui/switch";

interface WishFormProps {
  wish?: WishResponse | null;
  onSubmit: (data: WishFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function WishForm({
  wish,
  onSubmit,
  onCancel,
  isLoading = false,
}: WishFormProps) {
  const form = useForm<WishFormValues>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      amount: wish?.amount || 0,
      currency: wish?.currency || "usd",
      description: wish?.description || "",
      priority: wish?.priority || 0,
      date: wish?.date ? new Date(wish.date) : new Date(),
      fulfilled: wish?.fulfilled || false,
    },
  });

  return (
    <form id="form-wish" onSubmit={form.handleSubmit((data) => onSubmit(data))}>
      <FieldGroup>
        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-wish-description">
                Description
              </FieldLabel>
              <Input
                {...field}
                id="form-wish-description"
                aria-invalid={fieldState.invalid}
                placeholder="Wish Description"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-wish-amount">Amount</FieldLabel>

                <Input
                  {...field}
                  id="form-wish-amount"
                  aria-invalid={fieldState.invalid}
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
                <FieldLabel htmlFor="form-wish-currency">Currency</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-wish-currency"
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
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-wish-date">Target Date</FieldLabel>
              <Input
                {...field}
                id="form-wish-date"
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
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="priority"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-wish-priority">Priority</FieldLabel>

                <Input
                  {...field}
                  id="form-wish-priority"
                  aria-invalid={fieldState.invalid}
                  placeholder="0.00"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="fulfilled"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor="form-account-fulfilled">
                    Fulfilled
                  </FieldLabel>
                  <FieldDescription>Turn on if fulfilled</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
                <Switch
                  id="form-account-fulfilled"
                  name={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" form="form-wish" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {wish ? "Update" : "Create"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
