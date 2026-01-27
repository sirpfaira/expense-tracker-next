import { CreateAccountDialog } from "@/components/accounts/create-account-dialog";
import { AccountCard } from "@/components/accounts/account-card";
import { Account } from "@/lib/models/account";

export default async function AccountsPage() {
  //   const { data: accounts, isLoading:  accountsLoading } =
  //      useAccounts();
  const accounts: Account[] = [
    {
      _id: "dgdgsghshhssjjasa",
      name: "Bidvest",
      shortCode: "BIDV",
      type: "BANK",
      currency: "ZAR",
      balance: 23000,
      showInReports: true,
    },
  ];

  return (
    <div className="flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Accounts</h1>
          <p className="text-muted-foreground text-sm">Manage your accounts</p>
        </div>
        <CreateAccountDialog />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <AccountCard key={account.name} account={account} />
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full text-center p-8 text-muted-foreground border border-dashed rounded-lg">
            No accounts found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
