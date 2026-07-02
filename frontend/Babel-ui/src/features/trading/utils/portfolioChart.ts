import type { DashboardTrade } from "../../../lib/api/portfolioApi";

export type PortfolioChartPoint = {
  date: Date;
  value: number;
};

const INITIAL_CASH = 10_000;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function replayTrades(trades: DashboardTrade[]): PortfolioChartPoint[] {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.executedAtUtc).getTime() - new Date(b.executedAtUtc).getTime()
  );

  let cash = INITIAL_CASH;
  const positions = new Map<string, { qty: number; avgCost: number }>();
  const points: PortfolioChartPoint[] = [];

  if (sorted.length === 0) {
    return points;
  }

  points.push({ date: startOfDay(new Date(sorted[0].executedAtUtc)), value: INITIAL_CASH });

  for (const trade of sorted) {
    const symbol = trade.symbol.toUpperCase();
    const position = positions.get(symbol) ?? { qty: 0, avgCost: 0 };
    const side = trade.side.toLowerCase();

    if (side === "buy") {
      const cost = trade.price * trade.quantity;
      const nextQty = position.qty + trade.quantity;
      position.avgCost =
        nextQty > 0 ? (position.qty * position.avgCost + cost) / nextQty : 0;
      position.qty = nextQty;
      cash -= cost;
    } else {
      cash += trade.price * trade.quantity;
      position.qty -= trade.quantity;
      if (position.qty <= 0) {
        position.qty = 0;
        position.avgCost = 0;
      }
    }

    positions.set(symbol, position);

    let holdingsValue = 0;
    for (const [sym, pos] of positions) {
      if (pos.qty <= 0) continue;
      const mark = sym === symbol ? trade.price : pos.avgCost;
      holdingsValue += pos.qty * mark;
    }

    points.push({
      date: new Date(trade.executedAtUtc),
      value: cash + holdingsValue,
    });
  }

  return points;
}

function expandToDaily(points: PortfolioChartPoint[], currentTotal: number, days: number): PortfolioChartPoint[] {
  const today = startOfDay(new Date());
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1));

  if (points.length === 0) {
    const flat: PortfolioChartPoint[] = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      flat.push({ date, value: currentTotal });
    }
    return flat;
  }

  const sorted = [...points].sort((a, b) => a.date.getTime() - b.date.getTime());
  const daily: PortfolioChartPoint[] = [];
  let eventIndex = 0;
  let lastValue = sorted[0]?.value ?? INITIAL_CASH;

  for (let i = 0; i < days; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);

    while (
      eventIndex < sorted.length &&
      startOfDay(sorted[eventIndex].date).getTime() <= date.getTime()
    ) {
      lastValue = sorted[eventIndex].value;
      eventIndex++;
    }

    if (i === days - 1) {
      daily.push({ date: today, value: currentTotal });
    } else {
      daily.push({ date, value: lastValue });
    }
  }

  return daily;
}

export function buildPortfolioChartSeries(
  trades: DashboardTrade[],
  currentTotal: number,
  days = 14
): PortfolioChartPoint[] {
  return expandToDaily(replayTrades(trades), currentTotal, days);
}

export function formatChartDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatChartValue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}
