export interface CricketMatch {
  id: number;
  date: string;
  year: number;
  format: "Test" | "ODI" | "T20";
  venue: string;
  team1: string;
  team2: string;
  tossWinner: string;
  tossDecision: "bat" | "field";
  matchWinner: string;
  tossWinFlag: 0 | 1;
  matchWinFlag: 0 | 1;
  tossAndMatchWin: 0 | 1;
}

const teams = ["India", "Australia", "England", "South Africa", "New Zealand", "Pakistan", "Sri Lanka", "West Indies", "Bangladesh", "Afghanistan"];

const venues: Record<string, string> = {
  "India": "Wankhede Stadium, Mumbai",
  "Australia": "MCG, Melbourne",
  "England": "Lord's, London",
  "South Africa": "Wanderers, Johannesburg",
  "New Zealand": "Eden Park, Auckland",
  "Pakistan": "Gaddafi Stadium, Lahore",
  "Sri Lanka": "R. Premadasa Stadium, Colombo",
  "West Indies": "Kensington Oval, Barbados",
  "Bangladesh": "Sher-e-Bangla, Dhaka",
  "Afghanistan": "Kabul Cricket Stadium, Kabul",
};

function generateMatches(): CricketMatch[] {
  const matches: CricketMatch[] = [];
  let id = 1;
  const formats: CricketMatch["format"][] = ["Test", "ODI", "T20"];

  // Seed-based pseudo-random for consistency
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let year = 2015; year <= 2024; year++) {
    for (const format of formats) {
      const matchCount = format === "Test" ? 3 : format === "ODI" ? 4 : 5;
      for (let m = 0; m < matchCount; m++) {
        const t1Idx = Math.floor(rand() * teams.length);
        let t2Idx = Math.floor(rand() * teams.length);
        while (t2Idx === t1Idx) t2Idx = Math.floor(rand() * teams.length);

        const team1 = teams[t1Idx];
        const team2 = teams[t2Idx];
        const tossWinner = rand() > 0.5 ? team1 : team2;
        const tossDecision: "bat" | "field" = rand() > 0.48 ? "field" : "bat";

        // Toss winner wins match ~52% of the time (slight advantage)
        const tossWinnerWinsMatch = rand() < 0.52;
        const matchWinner = tossWinnerWinsMatch ? tossWinner : (tossWinner === team1 ? team2 : team1);

        const venueTeam = rand() > 0.5 ? team1 : team2;
        const venue = venues[venueTeam] || "Neutral Venue";

        const month = Math.floor(rand() * 12) + 1;
        const day = Math.floor(rand() * 28) + 1;

        matches.push({
          id: id++,
          date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          year,
          format,
          venue,
          team1,
          team2,
          tossWinner,
          tossDecision,
          matchWinner,
          tossWinFlag: 1,
          matchWinFlag: 1,
          tossAndMatchWin: tossWinnerWinsMatch ? 1 : 0,
        });
      }
    }
  }

  return matches;
}

export const cricketMatches = generateMatches();

export const allFormats: CricketMatch["format"][] = ["Test", "ODI", "T20"];
export const allTeams = teams;
export const allYears = Array.from({ length: 10 }, (_, i) => 2015 + i);
