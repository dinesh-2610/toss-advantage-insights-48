import { useState, useMemo } from "react";
import { cricketMatches, allFormats, allYears, type CricketMatch } from "@/data/cricketData";
import { computeTossStats, getFormatComparison, getYearlyTrend, getTeamStats } from "@/lib/statistics";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = [
  "hsl(215, 65%, 45%)",
  "hsl(195, 60%, 45%)",
  "hsl(160, 50%, 42%)",
  "hsl(35, 80%, 55%)",
  "hsl(0, 60%, 55%)",
];

function FilterBadge({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`filter-badge ${active ? "filter-badge-active" : "filter-badge-inactive"}`}
    >
      {label}
    </button>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="stat-card animate-fade-in">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [selectedFormat, setSelectedFormat] = useState<CricketMatch["format"] | "All">("All");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let data = cricketMatches;
    if (selectedFormat !== "All") data = data.filter((m) => m.format === selectedFormat);
    if (selectedYear) data = data.filter((m) => m.year === selectedYear);
    return data;
  }, [selectedFormat, selectedYear]);

  const stats = useMemo(() => computeTossStats(filtered), [filtered]);
  const formatComparison = useMemo(() => getFormatComparison(cricketMatches), []);
  const yearlyTrend = useMemo(() => getYearlyTrend(selectedFormat === "All" ? cricketMatches : cricketMatches.filter(m => m.format === selectedFormat)), [selectedFormat]);
  const teamStats = useMemo(() => getTeamStats(filtered).slice(0, 8), [filtered]);

  const pieData = [
    { name: "Bat First Win", value: stats.batFirstWins },
    { name: "Bat First Loss", value: stats.batFirstTotal - stats.batFirstWins },
    { name: "Field First Win", value: stats.fieldFirstWins },
    { name: "Field First Loss", value: stats.fieldFirstTotal - stats.fieldFirstWins },
  ];

  const tossBar = [
    { name: "Toss Winner Won", value: stats.tossWinMatchWin, fill: COLORS[0] },
    { name: "Toss Winner Lost", value: stats.tossWinMatchLoss, fill: COLORS[4] },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Interactive analysis of toss impact across international cricket</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-muted-foreground self-center mr-1">Format:</span>
        <FilterBadge label="All" active={selectedFormat === "All"} onClick={() => setSelectedFormat("All")} />
        {allFormats.map((f) => (
          <FilterBadge key={f} label={f} active={selectedFormat === f} onClick={() => setSelectedFormat(f)} />
        ))}
        <span className="text-xs text-muted-foreground self-center ml-4 mr-1">Year:</span>
        <FilterBadge label="All" active={selectedYear === null} onClick={() => setSelectedYear(null)} />
        {allYears.map((y) => (
          <FilterBadge key={y} label={String(y)} active={selectedYear === y} onClick={() => setSelectedYear(y)} />
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Matches" value={String(stats.totalMatches)} />
        <StatCard label="Toss Win → Match Win" value={`${stats.tossWinPercentage.toFixed(1)}%`} sub={`${stats.tossWinMatchWin} of ${stats.totalMatches}`} />
        <StatCard label="Bat First Win %" value={`${stats.batFirstWinPct.toFixed(1)}%`} sub={`${stats.batFirstWins} of ${stats.batFirstTotal}`} />
        <StatCard label="Field First Win %" value={`${stats.fieldFirstWinPct.toFixed(1)}%`} sub={`${stats.fieldFirstWins} of ${stats.fieldFirstTotal}`} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-sm font-semibold mb-4">Toss Winner: Match Outcome</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tossBar} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(210,18%,88%)" }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {tossBar.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-sm font-semibold mb-4">Bat vs Field Decision Success</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" paddingAngle={2} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 10 }}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="chart-container">
          <h3 className="text-sm font-semibold mb-4">Year-wise Toss Advantage Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={yearlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 88%)" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis domain={[30, 70]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line type="monotone" dataKey="tossWinPct" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 3 }} name="Toss Win → Match Win %" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="text-sm font-semibold mb-4">Format Comparison</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={formatComparison} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 18%, 88%)" />
              <XAxis dataKey="format" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="tossWinPct" name="Toss Win %" fill={COLORS[0]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="batFirstWinPct" name="Bat First %" fill={COLORS[2]} radius={[3, 3, 0, 0]} />
              <Bar dataKey="fieldFirstWinPct" name="Field First %" fill={COLORS[1]} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Stats Table */}
      <div className="chart-container">
        <h3 className="text-sm font-semibold mb-4">Team-wise Toss Advantage</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wider">
                <th className="pb-2 pr-4">Team</th>
                <th className="pb-2 pr-4">Matches</th>
                <th className="pb-2 pr-4">Toss Wins</th>
                <th className="pb-2 pr-4">Toss & Match Win</th>
                <th className="pb-2">Win %</th>
              </tr>
            </thead>
            <tbody>
              {teamStats.map((t) => (
                <tr key={t.team} className="border-b border-muted/50 last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{t.team}</td>
                  <td className="py-2.5 pr-4 font-mono text-muted-foreground">{t.matches}</td>
                  <td className="py-2.5 pr-4 font-mono text-muted-foreground">{t.tossWins}</td>
                  <td className="py-2.5 pr-4 font-mono text-muted-foreground">{t.tossWinMatchWin}</td>
                  <td className="py-2.5 font-mono font-medium">{t.tossWinPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
