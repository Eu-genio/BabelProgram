import { apiFetch } from "./client";

export type TradeSide = "buy" | "sell";

type TradeRequest = {
  portfolioId: number;
  symbol: string;
  quantity: number;
};

/** Response shape from POST /api/trades/buy|sell */
export type TradeExecutionResult = {
  id: number;
  portfolioId: number;
  assetId: number;
  side: string;
  quantity: number;
  price: number;
  totalAmount: number;
  executedAtUtc: string;
  quoteAsOfUtc?: string | null;
};

export function submitTrade(side: TradeSide, payload: TradeRequest) {
  return apiFetch<TradeExecutionResult>(`/trades/${side}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
