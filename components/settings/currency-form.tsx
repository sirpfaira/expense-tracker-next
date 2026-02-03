"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { CurrencyFormValues, currencySchema } from "@/lib/models/summary";
import { Loader2 } from "lucide-react";
import { UserResponse } from "@/lib/models/user";

type CurrencyFormProps = {
  user: UserResponse | null;
  onSubmit: (data: CurrencyFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
};

const CurrencyForm = ({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: CurrencyFormProps) => {
  const form = useForm<CurrencyFormValues>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      currency: user?.currency || "usd",
    },
  });

  return (
    <form
      id="form-currency"
      onSubmit={form.handleSubmit((data) => onSubmit(data))}
    >
      <FieldGroup>
        <Controller
          name="currency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-user-currency">Currency</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-user-currency"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem key={"usd"} value={"usd"}>
                    USD
                  </SelectItem>
                  <SelectItem key={"zar"} value={"zar"}>
                    ZAR
                  </SelectItem>
                </SelectContent>
              </Select>
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
          <Button type="submit" form="form-currency" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};

export default CurrencyForm;
