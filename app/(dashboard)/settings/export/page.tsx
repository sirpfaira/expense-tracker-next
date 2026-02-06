"use client";

import LoadingIndicator from "@/components/layout/loading-indicator";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { useAccounts } from "@/hooks/use-accounts";
import { useBudgets } from "@/hooks/use-budgets";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { useWishes } from "@/hooks/use-wishes";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ExportData = () => {
  const { user } = useAuth();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { data: transactions } = useTransactions();
  const { data: budgets } = useBudgets();
  const { data: wishes } = useWishes();
  const [isExportingData, setIsExportingData] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExportingData(true);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          name: user?.name,
        },
        transactions: transactions || [],
        categories: categories || [],
        budgets: budgets || [],
        wishes: wishes || [],
        accounts: accounts || [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `expense-tracker-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Data exported successfully");
    } catch {
      toast.error("Failed to export data");
    } finally {
      setIsExportingData(false);
    }
  };
  return (
    <div className="p-2 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Export</h1>
        <p className="text-muted-foreground">Export and manage your data</p>
      </div>
      {user && transactions && categories && budgets && wishes && accounts ? (
        <div className="flex space-y-2 w-full justify-between items-center">
          <p className="text-lg">Your data is ready</p>
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={isExportingData}
          >
            {isExportingData ? (
              <div className="flex space-x-2 items-center">
                <Loader2 className="size-4 animate-spin" />
                <span>Downloading...</span>
              </div>
            ) : (
              <div className="flex space-x-2 items-center">
                <Download className="size-4" />
                <span>Download</span>
              </div>
            )}
          </Button>
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
};

export default ExportData;
