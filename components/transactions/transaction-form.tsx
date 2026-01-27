"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  TransactionResponse,
  TransactionType,
  TransactionCategory,
  CATEGORY_LABELS,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/lib/models/transaction";

interface TransactionFormProps {
  transaction?: TransactionResponse | null;
  onSubmit: (data: {
    type: TransactionType;
    category: TransactionCategory;
    amount: number;
    description: string;
    date: string;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function TransactionForm({
  transaction,
  onSubmit,
  onCancel,
  isLoading = false,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(
    transaction?.type || "expense",
  );
  const [category, setCategory] = useState<TransactionCategory>(
    transaction?.category || "food",
  );
  const [amount, setAmount] = useState(transaction?.amount?.toString() || "");
  const [description, setDescription] = useState(
    transaction?.description || "",
  );
  const [date, setDate] = useState(
    transaction?.date
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Reset category when type changes
  useEffect(() => {
    if (!categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type, category, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      category,
      amount: parseFloat(amount),
      description,
      date,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={type}
          onValueChange={(value: TransactionType) => setType(value)}
        >
          <SelectTrigger id="type" className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={(value: TransactionCategory) => setCategory(value)}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <DialogFooter className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {transaction ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
