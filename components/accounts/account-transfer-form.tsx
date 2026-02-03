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
import {
  AccountResponse,
  AccountTransferValues,
  transferSchema,
  AccountCurrency,
  TransferInput,
} from "@/lib/models/account";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";

interface AccountFormProps {
  accounts: AccountResponse[];
  onSubmit: (data: TransferInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AccountTransferForm({
  accounts,
  onSubmit,
  onCancel,
  isLoading = false,
}: AccountFormProps) {
  const [currency, setCurrency] = useState<AccountCurrency>("usd");
  const form = useForm<AccountTransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from: "",
      to: "",
      amount: 0,
      currency: "usd",
      date: new Date(),
    },
  });

  const accountValue = form.watch("from");

  useEffect(() => {
    if (accountValue) {
      // Update currency based on account
      const account = accounts?.find((acc) => acc.shortCode === accountValue);
      setCurrency(account?.currency || "usd");
    } else {
      setCurrency("usd");
    }
  }, [accountValue, form.setValue]);

  const submitHandler = async (data: AccountTransferValues) => {
    const payload: TransferInput = {
      from: data.from as string,
      to: data.to as string,
      currency: currency,
      amount: data.amount as number,
      date: data.date.toLocaleDateString("en-ZA"),
    };
    onSubmit(payload);
  };

  return (
    <form id="form-transfer" onSubmit={form.handleSubmit(submitHandler)}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="from"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transfer-from">
                  From Account
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-transfer-from"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {accounts.map((acc) => (
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
            name="to"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transfer-to">To Account</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-transfer-to"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {accounts.map((acc) => (
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
                <FieldLabel htmlFor="form-transfer-amount">Amount</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id="form-transfer-amount"
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
          <Controller
            name="date"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-transfer-date">Date</FieldLabel>
                <Input
                  {...field}
                  id="form-transfer-date"
                  type="date"
                  aria-invalid={fieldState.invalid}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().split("T")[0]
                      : field.value
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
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
          <Button type="submit" form="form-transfer" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
