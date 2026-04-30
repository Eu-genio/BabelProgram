import { apiFetch } from "./client";

export type MarketQuote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  asOfUtc: string;
};

export type MarketNewsItem = {
  symbol: string;
  headline: string;
  source: string;
  url: string;
  publishedAtUtc: string;
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
