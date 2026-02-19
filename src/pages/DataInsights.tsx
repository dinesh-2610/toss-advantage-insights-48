import { useMemo } from "react";
import { cricketMatches } from "@/data/cricketData";
import { chiSquareTest, computeTossStats, getFormatComparison } from "@/lib/statistics";
import { CheckCircle, XCircle, TrendingUp } from "lucide-react";

export default function DataInsights() {
  const stats = useMemo(() => computeTossStats(cricketMatches), []);
  const chiResult = useMemo(() => chiSquareTest(cricketMatches), []);
  const formatStats = useMemo(() => getFormatComparison(cricketMatches), []);

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="section-title">Data Insights</h1>
        <p className="section-subtitle">Statistical analysis and hypothesis testing results</p>
      </div>

      {/* Chi-Square Test */}
      <div className="insight-card">
        <div className="flex items-start gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h2 className="text-base font-semibold">Chi-Square Test of Independence</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              H₀: Toss outcome and match outcome are independent
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground">χ² Statistic</p>
            <p className="text-lg font-mono font-bold">{chiResult.chiSquare}</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground">p-Value</p>
            <p className="text-lg font-mono font-bold">{chiResult.pValue}</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-xs text-muted-foreground">Degrees of Freedom</p>
            <p className="text-lg font-mono font-bold">{chiResult.degreesOfFreedom}</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 rounded-md p-3 text-sm ${chiResult.significant ? "bg-primary/5 text-primary" : "bg-muted/50 text-muted-foreground"}`}>
          {chiResult.significant ? (
            <CheckCircle className="h-4 w-4 text-stat-positive" />
          ) : (
            <XCircle className="h-4 w-4 text-stat-negative" />
          )}
          {chiResult.interpretation}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="insight-card">
        <h2 className="text-base font-semibold mb-4">Summary Statistics</h2>
        <div className="space-y-3 text-sm">
          <Row label="Total matches analyzed" value={String(stats.totalMatches)} />
          <Row label="Toss winner won the match" value={`${stats.tossWinPercentage.toFixed(1)}% (${stats.tossWinMatchWin}/${stats.totalMatches})`} />
          <Row label="Bat-first decision success" value={`${stats.batFirstWinPct.toFixed(1)}% (${stats.batFirstWins}/${stats.batFirstTotal})`} />
          <Row label="Field-first decision success" value={`${stats.fieldFirstWinPct.toFixed(1)}% (${stats.fieldFirstWins}/${stats.fieldFirstTotal})`} />
        </div>
      </div>

      {/* Format-wise Breakdown */}
      <div className="insight-card">
        <h2 className="text-base font-semibold mb-4">Format-wise Analysis</h2>
        <div className="space-y-4">
          {formatStats.map((f) => (
            <div key={f.format} className="bg-muted/30 rounded-md p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{f.format}</span>
                <span className="text-xs text-muted-foreground">{f.totalMatches} matches</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Toss Advantage</p>
                  <p className="font-mono font-semibold text-foreground">{f.tossWinPct}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bat First Win</p>
                  <p className="font-mono font-semibold text-foreground">{f.batFirstWinPct}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Field First Win</p>
                  <p className="font-mono font-semibold text-foreground">{f.fieldFirstWinPct}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="insight-card">
        <h2 className="text-base font-semibold mb-3">Key Findings</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="text-primary">1.</span>
            Toss winners win approximately {stats.tossWinPercentage.toFixed(0)}% of matches, suggesting a {stats.tossWinPercentage > 52 ? "slight" : "marginal"} advantage.
          </li>
          <li className="flex gap-2">
            <span className="text-primary">2.</span>
            {stats.fieldFirstWinPct > stats.batFirstWinPct
              ? "Field-first decisions yield a higher win rate than bat-first decisions."
              : "Bat-first decisions yield a comparable or higher win rate than field-first decisions."}
          </li>
          <li className="flex gap-2">
            <span className="text-primary">3.</span>
            The chi-square test {chiResult.significant ? "confirms" : "does not confirm"} a statistically significant relationship between toss and match outcome at α = 0.05.
          </li>
          <li className="flex gap-2">
            <span className="text-primary">4.</span>
            The advantage {stats.tossWinPercentage > 55 ? "is noticeable" : "appears minimal"} and varies across formats and conditions.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-muted/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </div>
  );
}
