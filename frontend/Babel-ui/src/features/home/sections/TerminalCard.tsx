import "../home.css";

const LINES = [
  { text: "~/CurrentlyBuilding", tone: "path" },
  { text: "babel-trading-simulator", tone: "folder" },
  { text: "└── Full-stack paper trading platform", tone: "muted" },
  { text: "    ├── ASP.NET Core API + React", tone: "code" },
  { text: "    ├── Portfolio watchlists & paper trades", tone: "code" },
  { text: "    └── Finnhub + Yahoo market data", tone: "accent" },
];

export default function TerminalCard() {
  return (
    <div className="terminal-card" aria-label="Currently building preview">
      <div className="terminal-chrome">
        <span className="terminal-dot terminal-dot-red" />
        <span className="terminal-dot terminal-dot-yellow" />
        <span className="terminal-dot terminal-dot-green" />
        <span className="terminal-title">terminal</span>
      </div>
      <pre className="terminal-body">
        {LINES.map((line) => (
          <code key={line.text} className={`terminal-line terminal-line-${line.tone}`}>
            {line.text}
          </code>
        ))}
      </pre>
    </div>
  );
}
