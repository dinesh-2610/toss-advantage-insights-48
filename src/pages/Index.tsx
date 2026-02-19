import { Link } from "react-router-dom";
import { BarChart3, ArrowRight, TrendingUp, PieChart } from "lucide-react";
import { cricketMatches } from "@/data/cricketData";
import { computeTossStats } from "@/lib/statistics";

const stats = computeTossStats(cricketMatches);

export default function Index() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero */}
      <section className="text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary rounded-full px-4 py-1.5 text-xs font-medium">
          <BarChart3 className="h-3.5 w-3.5" />
          B.Tech Research Project
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
          An Empirical Analysis of Toss Advantage in Cricket Matches
        </h1>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Investigating whether winning the toss provides a statistically significant advantage
          in international cricket across Test, ODI, and T20 formats.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground rounded-md px-5 py-2.5 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Data Insights
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <div className="stat-card text-center animate-fade-in">
          <BarChart3 className="h-8 w-8 text-primary mx-auto mb-3 opacity-70" />
          <p className="text-3xl font-bold font-mono">{stats.totalMatches}</p>
          <p className="text-xs text-muted-foreground mt-1">Matches Analyzed</p>
        </div>
        <div className="stat-card text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3 opacity-70" />
          <p className="text-3xl font-bold font-mono">{stats.tossWinPercentage.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground mt-1">Toss → Match Win Rate</p>
        </div>
        <div className="stat-card text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <PieChart className="h-8 w-8 text-chart-3 mx-auto mb-3 opacity-70" />
          <p className="text-3xl font-bold font-mono">3</p>
          <p className="text-xs text-muted-foreground mt-1">Formats Compared</p>
        </div>
      </section>

      {/* Scope */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-center">Research Scope</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            "Win percentage comparison",
            "Chi-square independence test",
            "Format-wise toss advantage",
            "Bat vs Field decision impact",
            "Year-wise trend analysis",
            "Team-level statistics",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 bg-card rounded-md border px-4 py-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-muted-foreground">{item}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
