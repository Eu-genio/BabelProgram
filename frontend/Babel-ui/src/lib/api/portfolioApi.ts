import { apiFetch } from "./client";

export type PortfolioResponse = {
  id: number;
  name: string;
  cashBalance: number;
};

type CreatePortfolioRequest = {
  name: string;
};

export type DashboardHolding = {
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
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

export type PortfolioDashboardResponse = {
  cash: number;
  holdingsValue: number;
  totalValue: number;
  holdings: DashboardHolding[];
  recentTrades: DashboardTrade[];
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