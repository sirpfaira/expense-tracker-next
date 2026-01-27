import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, PieChart, TrendingUp, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Expense Tracker</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Take Control of Your Finances
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Track expenses, set budgets, and gain insights into your spending
            habits. Start your journey to financial freedom today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Tracking
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <PieChart className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Visual Analytics
            </h3>
            <p className="text-sm text-muted-foreground">
              Beautiful charts and graphs to visualize your spending patterns
              over time.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Budget Goals</h3>
            <p className="text-sm text-muted-foreground">
              Set monthly budgets and track your progress towards financial
              goals.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your financial data is encrypted and protected with
              industry-standard security.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Expense Tracker
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, MongoDB, and TanStack Query
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
