import path from "path";
import { config } from "dotenv";
config({ path: path.resolve(process.cwd(), ".env.local") });

import { getDatabase } from "../lib/mongodb";
import fs from "fs";
import { program } from "commander";
import Papa from "papaparse";
import { Transaction } from "../lib/models/transaction";

const csvFilePath = path.resolve(process.cwd(), "transactions.csv");

const parseCSV = async (filePath: string): Promise<any[]> => {
  const csvFile = fs.readFileSync(filePath, "utf8");
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

const seedTransactions = async () => {
  try {
    const db = await getDatabase();
    const transactionsCollection = db.collection<Transaction>("transactions");

    const transactionsFromCSV = await parseCSV(csvFilePath);
    if (transactionsFromCSV.length === 0) {
      console.log("CSV file is empty or not found. No transactions to seed.");
      return;
    }

    const transactions: Transaction[] = transactionsFromCSV.map((t: any) => ({
      ...t,
      amount: parseFloat(t.amount),
      date: new Date(t.date),
      username: t.username || "default-user",
    }));

    // await transactionsCollection.deleteMany({});
    await transactionsCollection.insertMany(transactions);

    console.log(
      `${transactions.length} transactions have been seeded successfully.`,
    );
  } catch (error) {
    console.error("Error seeding transactions:", error);
  } finally {
    process.exit();
  }
};

program
  .command("seed")
  .description("Seed the database with transactions from a CSV file")
  .action(seedTransactions);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
