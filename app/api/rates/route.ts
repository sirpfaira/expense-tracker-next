import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Rate, sanitizeRate } from "@/lib/models/summary";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const dbRates = await db.collection<Rate>("rates").find().toArray();
    const rates = dbRates.map(sanitizeRate);

    if (rates.length === 0) {
      const newRate = await fetchCurrentRates();
      if (!newRate) {
        return NextResponse.json(
          { error: "Failed to fetch accounts" },
          { status: 500 },
        );
      }
      return NextResponse.json({
        rate: newRate,
      });
    } else {
      // Check if rate is older than 24 hours
      const lastUpdate = new Date(rates[0].date);
      const timeDiff = new Date().getTime() - lastUpdate.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);
      if (hoursDiff > 24) {
        const newRate = await fetchCurrentRates();
        if (!newRate) {
          return NextResponse.json(
            { error: "Failed to fetch accounts" },
            { status: 500 },
          );
        }
        return NextResponse.json({
          rate: newRate,
        });
      }
      return NextResponse.json({
        rate: rates[0],
      });
    }
  } catch (error) {
    console.error("Get accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 },
    );
  }
}

async function fetchCurrentRates(): Promise<Rate | null> {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    console.warn(
      "EXCHANGE_RATE_API_KEY is not set. Skipping exchange rate update.",
    );
    return null;
  }

  try {
    // Fetching base USD rates. Adjust URL if using a different provider.
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`,
    );
    const data = await response.json();

    if (data.result !== "success") {
      throw new Error(`API Error: ${data["error-type"]}`);
    }

    const rates = data.conversion_rates;
    const zarRate = rates["ZAR"];

    if (!zarRate) {
      throw new Error("ZAR rate not found in response!");
    }

    const today = new Date();

    const db = await getDatabase();
    // Upsert USD -> ZAR
    const result = await db.collection<Rate>("rates").updateOne(
      {
        base: "USD",
        target: "ZAR",
      },
      {
        $set: {
          value: zarRate,
          date: today,
        },
      },
      {
        upsert: true,
      },
    );
    return {
      _id: result.upsertedId || undefined,
      base: "USD",
      target: "ZAR",
      value: zarRate,
      date: today,
    };
  } catch (error) {
    console.error("Failed to update exchange rates:", error);
    return null;
  }
}
