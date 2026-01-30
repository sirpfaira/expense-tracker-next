"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import {
  AccountResponse,
  ACCOUNT_CURRENCIES,
  ACCOUNT_TYPES,
  AccountFormValues,
  accountSchema,
} from "@/lib/models/account";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AccountFormProps {
  account?: AccountResponse | null;
  onSubmit: (data: AccountFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AccountForm({
  account,
  onSubmit,
  onCancel,
  isLoading = false,
}: AccountFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: account?.name || "",
      shortCode: account?.shortCode || "",
      type: account?.type || "cash",
      currency: account?.currency || "usd",
      balance: account?.balance || 0,
      showInReports: account?.showInReports || true,
    },
  });

  return (
    <form
      id="form-account"
      onSubmit={form.handleSubmit((data) => onSubmit(data))}
    >
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-account-name">Name</FieldLabel>
              <Input
                {...field}
                id="form-account-name"
                aria-invalid={fieldState.invalid}
                placeholder="Account Name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="shortCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-account-shortCode">
                  Short Code
                </FieldLabel>
                <Input
                  {...field}
                  id="form-account-shortCode"
                  aria-invalid={fieldState.invalid}
                  placeholder="Short Code"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-account-type">Type</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-account-type"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {ACCOUNT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/^./, (char) => char.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Controller
            name="currency"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-account-currency">
                  Currency
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="form-account-currency"
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
          <Controller
            name="balance"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-account-balance">Balance</FieldLabel>
                <Input
                  {...field}
                  id="form-account-balance"
                  aria-invalid={fieldState.invalid}
                  placeholder="Balance"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="showInReports"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor="form-account-showInReports">
                  Show in reports
                </FieldLabel>
                <FieldDescription>
                  Turn on for account to be included in reports
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Switch
                id="form-account-showInReports"
                name={field.name}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
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
          <Button type="submit" form="form-account" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {account ? "Update" : "Create"}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
