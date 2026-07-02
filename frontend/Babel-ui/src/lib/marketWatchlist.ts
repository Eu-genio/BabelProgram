const STORAGE_KEY = "babel:market-watchlist";
const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "TSLA"];

export function parseWatchlistInput(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
}

export function getMarketWatchlistSymbols(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SYMBOLS;

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_SYMBOLS;

    const symbols = parsed
      .filter((item): item is string => typeof item === "string")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    return symbols.length > 0 ? symbols : DEFAULT_SYMBOLS;
  } catch {
    return DEFAULT_SYMBOLS;
  }
}

export function saveMarketWatchlistSymbols(symbols: string[]): void {
  const normalized = [...new Set(symbols.map((s) => s.trim().toUpperCase()).filter(Boolean))];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
}

export function getDefaultWatchlistInput(): string {
  return getMarketWatchlistSymbols().join(",");
}
