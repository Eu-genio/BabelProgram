import { apiFetch } from "./client";

export function getDashboard(portfolioId: number) {
  return apiFetch(`/portfolios/${portfolioId}/dashboard`);
}