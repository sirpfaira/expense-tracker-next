"use client";

import { useQuery } from "@tanstack/react-query";
import { RateResponse } from "@/lib/models/summary";

async function fetchRates(): Promise<RateResponse> {
  const res = await fetch("/api/rates");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to fetch rates!");
  }
  const data = await res.json();
  return data.rate;
}

export function useRates() {
  return useQuery({
    queryKey: ["rates"],
    queryFn: fetchRates,
  });
}
