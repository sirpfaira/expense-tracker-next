import { ObjectId } from "mongodb";
import { z } from "zod";

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  shortCode: z.string().optional(),
  type: z.enum(["BANK", "CASH", "SAVINGS"]),
  currency: z.enum(["ZAR", "USD"]),
  showInReports: z.boolean(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export interface Account {
  _id?: ObjectId | string;
  name: string;
  shortCode: string;
  type: "BANK" | "CASH";
  currency: "ZAR" | "USD";
  balance: number;
  showInReports: boolean;
}
