import { CricketMatch } from "@/data/cricketData";

export interface TossStats {
  totalMatches: number;
  tossWinMatchWin: number;
  tossWinMatchLoss: number;
  tossWinPercentage: number;
  batFirstWins: number;
  batFirstTotal: number;
  fieldFirstWins: number;
  fieldFirstTotal: number;
  batFirstWinPct: number;
  fieldFirstWinPct: number;
}

export function computeTossStats(matches: CricketMatch[]): TossStats {
  const totalMatches = matches.length;
  const tossWinMatchWin = matches.filter((m) => m.tossAndMatchWin === 1).length;
  const tossWinMatchLoss = totalMatches - tossWinMatchWin;

  const batFirst = matches.filter((m) => m.tossDecision === "bat");
  const fieldFirst = matches.filter((m) => m.tossDecision === "field");

  const batFirstWins = batFirst.filter((m) => m.tossAndMatchWin === 1).length;
  const fieldFirstWins = fieldFirst.filter((m) => m.tossAndMatchWin === 1).length;

  return {
    totalMatches,
    tossWinMatchWin,
    tossWinMatchLoss,
    tossWinPercentage: totalMatches ? (tossWinMatchWin / totalMatches) * 100 : 0,
    batFirstWins,
    batFirstTotal: batFirst.length,
    fieldFirstWins,
    fieldFirstTotal: fieldFirst.length,
    batFirstWinPct: batFirst.length ? (batFirstWins / batFirst.length) * 100 : 0,
    fieldFirstWinPct: fieldFirst.length ? (fieldFirstWins / fieldFirst.length) * 100 : 0,
  };
}

export interface ChiSquareResult {
  chiSquare: number;
  pValue: number;
  degreesOfFreedom: number;
  significant: boolean;
  interpretation: string;
}

export function chiSquareTest(matches: CricketMatch[]): ChiSquareResult {
  // 2x2 contingency table: Toss won/lost vs Match won/lost
  const a = matches.filter((m) => m.tossAndMatchWin === 1).length; // toss win & match win
  const b = matches.length - a; // toss win & match loss (all are toss winners in our data model)
  // Since every match has a toss winner, we need to consider both perspectives
  const total = matches.length;

  // Expected under independence: 50% win rate regardless of toss
  const expectedWin = total * 0.5;
  const expectedLoss = total * 0.5;

  const chiSq = ((a - expectedWin) ** 2) / expectedWin + ((b - expectedLoss) ** 2) / expectedLoss;

  // Approximate p-value for 1 df using chi-square distribution
  const pValue = chiSquarePValue(chiSq, 1);

  return {
    chiSquare: Math.round(chiSq * 1000) / 1000,
    pValue: Math.round(pValue * 10000) / 10000,
    degreesOfFreedom: 1,
    significant: pValue < 0.05,
    interpretation: pValue < 0.05
      ? "The toss result has a statistically significant relationship with match outcome (p < 0.05)."
      : "No statistically significant relationship found between toss and match outcome (p ≥ 0.05).",
  };
}

// Approximate chi-square p-value using the regularized gamma function
function chiSquarePValue(x: number, k: number): number {
  if (x <= 0) return 1;
  const halfK = k / 2;
  const halfX = x / 2;
  // Using series expansion for lower incomplete gamma
  let sum = 0;
  let term = 1 / halfK;
  sum += term;
  for (let n = 1; n < 200; n++) {
    term *= halfX / (halfK + n);
    sum += term;
    if (Math.abs(term) < 1e-12) break;
  }
  const lowerGamma = Math.pow(halfX, halfK) * Math.exp(-halfX) * sum;
  const gamma = gammaFunction(halfK);
  const p = lowerGamma / gamma;
  return Math.max(0, Math.min(1, 1 - p));
}

function gammaFunction(n: number): number {
  // For half-integers using the formula
  if (n === 0.5) return Math.sqrt(Math.PI);
  if (n === 1) return 1;
  return (n - 1) * gammaFunction(n - 1);
}

export interface FormatStats {
  format: string;
  totalMatches: number;
  tossWinPct: number;
  batFirstWinPct: number;
  fieldFirstWinPct: number;
}

export function getFormatComparison(matches: CricketMatch[]): FormatStats[] {
  const formats = ["Test", "ODI", "T20"] as const;
  return formats.map((format) => {
    const fmt = matches.filter((m) => m.format === format);
    const stats = computeTossStats(fmt);
    return {
      format,
      totalMatches: stats.totalMatches,
      tossWinPct: Math.round(stats.tossWinPercentage * 10) / 10,
      batFirstWinPct: Math.round(stats.batFirstWinPct * 10) / 10,
      fieldFirstWinPct: Math.round(stats.fieldFirstWinPct * 10) / 10,
    };
  });
}

export interface YearlyTrend {
  year: number;
  tossWinPct: number;
  matches: number;
}

export function getYearlyTrend(matches: CricketMatch[]): YearlyTrend[] {
  const years = [...new Set(matches.map((m) => m.year))].sort();
  return years.map((year) => {
    const yearMatches = matches.filter((m) => m.year === year);
    const stats = computeTossStats(yearMatches);
    return {
      year,
      tossWinPct: Math.round(stats.tossWinPercentage * 10) / 10,
      matches: stats.totalMatches,
    };
  });
}

export interface TeamStats {
  team: string;
  matches: number;
  tossWins: number;
  tossWinMatchWin: number;
  tossWinPct: number;
}

export function getTeamStats(matches: CricketMatch[]): TeamStats[] {
  const teamSet = new Set<string>();
  matches.forEach((m) => { teamSet.add(m.team1); teamSet.add(m.team2); });

  return Array.from(teamSet).map((team) => {
    const teamMatches = matches.filter((m) => m.team1 === team || m.team2 === team);
    const tossWins = teamMatches.filter((m) => m.tossWinner === team);
    const tossWinMatchWin = tossWins.filter((m) => m.matchWinner === team).length;

    return {
      team,
      matches: teamMatches.length,
      tossWins: tossWins.length,
      tossWinMatchWin,
      tossWinPct: tossWins.length ? Math.round((tossWinMatchWin / tossWins.length) * 1000) / 10 : 0,
    };
  }).sort((a, b) => b.matches - a.matches);
}
