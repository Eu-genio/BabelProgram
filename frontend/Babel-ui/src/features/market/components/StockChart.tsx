import type { MarketChartPoint } from "../../../lib/api/marketApi";

type Props = {
  points: MarketChartPoint[];
  openPrice: number;
  positive: boolean;
};

const WIDTH = 800;
const HEIGHT = 220;
const PADDING = 16;

function buildLinePath(points: MarketChartPoint[]): string {
  if (points.length === 0) {
    return "";
  }

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const innerWidth = WIDTH - PADDING * 2;
  const innerHeight = HEIGHT - PADDING * 2;

  return points
    .map((point, index) => {
      const x = PADDING + (index / Math.max(points.length - 1, 1)) * innerWidth;
      const y = PADDING + innerHeight - ((point.price - min) / span) * innerHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function openLineY(points: MarketChartPoint[], openPrice: number): number | null {
  if (points.length === 0) {
    return null;
  }

  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const innerHeight = HEIGHT - PADDING * 2;

  return PADDING + innerHeight - ((openPrice - min) / span) * innerHeight;
}

export default function StockChart({ points, openPrice, positive }: Props) {
  if (points.length < 2) {
    return <p className="market-chart-empty">Not enough chart data for this range.</p>;
  }

  const path = buildLinePath(points);
  const openY = openLineY(points, openPrice);
  const stroke = positive ? "#027a48" : "#b42318";

  return (
    <svg
      className="market-chart"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="Stock price chart"
    >
      {openY !== null && (
        <line
          x1={PADDING}
          y1={openY}
          x2={WIDTH - PADDING}
          y2={openY}
          className="market-chart-open-line"
        />
      )}
      <path d={path} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
