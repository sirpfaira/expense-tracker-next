import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { Transaction, sanitizeTransaction } from "@/lib/models/transaction";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();
    const transaction = await db
      .collection<Transaction>("transactions")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ transaction: sanitizeTransaction(transaction) });
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transaction" },
      { status: 500 },
    );
  }
}

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const { id } = await params;

//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { error: "Invalid transaction ID" },
//         { status: 400 },
//       );
//     }

//     const body = await request.json();
//     const data = dbTransactionSchema.parse(body);
//     const db = await getDatabase();

//     const transaction = await db
//       .collection<Transaction>("transactions")
//       .findOne({
//         _id: new ObjectId(id),
//       });

//     if (!transaction) {
//       return NextResponse.json(
//         { error: "Transaction not found" },
//         { status: 404 },
//       );
//     }

//     const {
//       type: oldType,
//       amount: oldAmount,
//       account: oldAccount,
//       currency: oldCurrency,
//     } = transaction;
//     const {
//       type: newType,
//       amount: newAmount,
//       account: newAccount,
//       currency: newCurrency,
//     } = data;

//     const result = await db
//       .collection<Transaction>("transactions")
//       .findOneAndUpdate(
//         {
//           _id: new ObjectId(id),
//         },
//         {
//           $set: {
//             type: newType,
//             account: newAccount,
//             currency: newCurrency,
//             category: data.category,
//             amount: newAmount,
//             description: data.description.trim(),
//             date: new Date(data.date),
//           },
//         },
//         { returnDocument: "after" },
//       );

//     if (!result) {
//       return NextResponse.json(
//         { error: "Transaction not found" },
//         { status: 404 },
//       );
//     }

//     if (oldAccount !== newAccount) {
//     } else {
//       if (oldAmount !== newAmount) {
//         if (transaction.type === "income" && data.type === "income") {
//           await db
//             .collection("accounts")
//             .updateOne(
//               { shortCode: data.account },
//               { $inc: { balance: newAmount - oldAmount } },
//             );
//         } else if (transaction.type === "expense" && data.type === "expense") {
//           await db
//             .collection("accounts")
//             .updateOne(
//               { shortCode: data.account },
//               { $inc: { balance: oldAmount - newAmount } },
//             );
//         } else if (transaction.type === "income" && data.type === "expense") {
//         } else if (transaction.type === "expense" && data.type === "income") {
//         }
//       } else {
//         if (oldType !== newType) {
//           if (oldType === "income" && newType === "expense") {
//             await db
//               .collection("accounts")
//               .updateOne(
//                 { shortCode: newAccount },
//                 { $inc: { balance: (oldAmount + newAmount) * -1 } },
//               );
//           }
//         }
//       }
//     }

//     return NextResponse.json({ transaction: sanitizeTransaction(result) });
//   } catch (error) {
//     console.error("Update transaction error:", error);
//     if (error instanceof z.ZodError) {
//       return new NextResponse(JSON.stringify(error.issues), { status: 422 });
//     }
//     return NextResponse.json(
//       { error: "Failed to update transaction" },
//       { status: 500 },
//     );
//   }
// }

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400 },
      );
    }

    const db = await getDatabase();

    const transaction = await db
      .collection<Transaction>("transactions")
      .findOne({
        _id: new ObjectId(id),
      });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    const result = await db.collection<Transaction>("transactions").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      );
    }

    if (
      transaction.type === "income" ||
      transaction.category === "trf-transfer-in"
    ) {
      await db
        .collection("accounts")
        .updateOne(
          { shortCode: transaction.account },
          { $inc: { balance: transaction.amount * -1 } },
        );
    } else {
      await db
        .collection("accounts")
        .updateOne(
          { shortCode: transaction.account },
          { $inc: { balance: transaction.amount } },
        );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json(
      { error: "Failed to delete transaction" },
      { status: 500 },
    );
  }
}
