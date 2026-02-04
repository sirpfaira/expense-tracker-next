import AccountTransactionsDetails from "@/components/accounts/account-transactions-detail";
import LoadingIndicator from "@/components/layout/loading-indicator";

interface AccountTransactionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountTransactionsPage({
  params,
}: AccountTransactionsPageProps) {
  const { id } = await params;

  return (
    <>{id ? <AccountTransactionsDetails id={id} /> : <LoadingIndicator />}</>
  );
}
