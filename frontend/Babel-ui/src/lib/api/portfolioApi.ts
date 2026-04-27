import { apiFetch } from "./client";

export type PortfolioResponse = {
  id: number;
  name: string;
  cashBalance: number;
};

export type DashboardHolding = {
  assetId: number;
  symbol: string;
  quantity: number;
  price: number;
  value: number;
};

export type DashboardTrade = {
  id: number;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
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