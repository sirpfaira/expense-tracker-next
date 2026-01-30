import z from "zod";

export const currencySchema = z.object({
  currency: z.enum(["usd", "zar"]),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;
