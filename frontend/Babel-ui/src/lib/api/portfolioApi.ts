import { apiFetch } from "./client";

export type PortfolioResponse = {
  id: number;
  name: string;
  cashBalance: number;
};

export type SummaryRow = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number | null;
  averageVolume: number | null;
  previousClose: number;
  open: number;
};

export type HoldingsRow = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  weight: number;
  shares: number;
  cost: number;
  todaysGain: number;
  todaysGainPercent: number;
  estAnnualIncome: number | null;
  totalChange: number;
  totalChangePercent: number;
  value: number;
};

export type DashboardTrade = {
  id: number;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  executedAtUtc: string;
  quoteAsOfUtc?: string | null;
};

export type PortfolioNewsItem = {
  symbol: string;
  headline: string;
  source: string;
  url: string;
  publishedAtUtc: string;
};

export type PortfolioDashboardResponse = {
  portfolioId: number;
  name: string;
  cash: number;
  holdingsValue: number;
  totalValue: number;
  hasFollowedSymbols: boolean;
  summary: SummaryRow[];
  holdings: HoldingsRow[];
  trades: DashboardTrade[];
  news: PortfolioNewsItem[];
};

type CreatePortfolioRequest = {
  name: string;
  symbols: string[];
};

export function getMyPortfolios() {
  return apiFetch<PortfolioResponse[]>("/portfolios/my");
}

export function getDashboard(portfolioId: number) {
  return apiFetch<PortfolioDashboardResponse>(`/portfolios/${portfolioId}/dashboard`);
}

export function createPortfolio(payload: CreatePortfolioRequest) {
  return apiFetch<PortfolioResponse>("/portfolios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function addPortfolioSymbols(portfolioId: number, symbols: string[]) {
  return apiFetch<void>(`/portfolios/${portfolioId}/symbols`, {
    method: "POST",
    body: JSON.stringify({ symbols }),
  });
}

export function deletePortfolio(portfolioId: number) {
  return apiFetch<void>(`/portfolios/${portfolioId}`, {
    method: "DELETE",
  });
}

export function depositCash(portfolioId: number, amount: number) {
  return apiFetch<PortfolioResponse>(`/portfolios/${portfolioId}/deposit`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}
