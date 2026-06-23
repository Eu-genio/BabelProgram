import { apiFetch } from "./client";

export type MarketQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  asOfUtc: string;
  open: number;
  high: number;
  low: number;
  previousClose: number;
};

export type MarketNewsItem = {
  symbol: string;
  headline: string;
  source: string;
  url: string;
  publishedAtUtc: string;
};

export type ChartRange = "1D" | "1W" | "1M" | "3M" | "1Y";

export type MarketChartPoint = {
  timeUtc: string;
  price: number;
};

export type MarketChart = {
  symbol: string;
  range: ChartRange;
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  change: number;
  changePercent: number;
  points: MarketChartPoint[];
};

function buildSymbolsQuery(symbols: string[]): string {
  const normalized = symbols
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  return normalized.join(",");
}

export function getWatchlist(symbols: string[]) {
  const query = buildSymbolsQuery(symbols);
  return apiFetch<MarketQuote[]>(`/market/watchlist?symbols=${encodeURIComponent(query)}`);
}

export function getTopMovers() {
  return apiFetch<MarketQuote[]>("/market/movers");
}

export function getMarketNews(symbols: string[]) {
  const query = buildSymbolsQuery(symbols);
  return apiFetch<MarketNewsItem[]>(`/market/news?symbols=${encodeURIComponent(query)}`);
}

export function getStockChart(symbol: string, range: ChartRange) {
  const normalized = symbol.trim().toUpperCase();
  return apiFetch<MarketChart>(`/market/${encodeURIComponent(normalized)}/chart?range=${range}`);
}
