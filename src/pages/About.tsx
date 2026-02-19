export default function About() {
  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="section-title">About This Project</h1>
        <p className="section-subtitle">B.Tech Project — Computer Science & Engineering</p>
      </div>

      <div className="insight-card space-y-4 text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Project Overview</h2>
        <p>
          This platform provides an empirical analysis of toss advantage in international cricket matches
          across Test, ODI, and T20 formats. By collecting and analyzing match data, we examine whether
          winning the toss provides a statistically significant advantage in determining the match outcome.
        </p>

        <h2 className="text-base font-semibold text-foreground pt-2">Methodology</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Data collected from international cricket matches (2015–2024)</li>
          <li>Abandoned and no-result matches excluded</li>
          <li>Chi-square test for independence applied to test toss–outcome relationship</li>
          <li>Win percentages computed across formats, teams, and decisions</li>
          <li>Year-wise trend analysis to detect temporal patterns</li>
        </ul>

        <h2 className="text-base font-semibold text-foreground pt-2">Tech Stack</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-muted/50 rounded-md p-3">
            <p className="font-medium text-foreground">Frontend</p>
            <p>React.js + TypeScript</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="font-medium text-foreground">Visualization</p>
            <p>Recharts</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="font-medium text-foreground">Styling</p>
            <p>Tailwind CSS</p>
          </div>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="font-medium text-foreground">Analysis</p>
            <p>Chi-Square, Probability</p>
          </div>
        </div>

        <h2 className="text-base font-semibold text-foreground pt-2">Future Enhancements</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Real-time API integration (CricAPI / RapidAPI)</li>
          <li>PostgreSQL database for persistent storage</li>
          <li>Logistic regression model</li>
          <li>Venue and home/away analysis</li>
          <li>PDF report generation</li>
        </ul>
      </div>
    </div>
  );
}
