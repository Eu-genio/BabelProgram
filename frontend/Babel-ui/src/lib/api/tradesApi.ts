import { apiFetch } from "./client";

export type TradeSide = "buy" | "sell";

type TradeRequest = {
  portfolioId: number;
  symbol: string;
  quantity: number;
};

export function submitTrade(side: TradeSide, payload: TradeRequest) {
  return apiFetch(`/trades/${side}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
