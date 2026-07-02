import { useMemo } from "react";
import type { DashboardTrade } from "../../../lib/api/portfolioApi";
import {
  buildPortfolioChartSeries,
  formatChartDate,
  formatChartValue,
} from "../../trading/utils/portfolioChart";

type Props = {
  trades: DashboardTrade[];
  currentTotal: number;
};

const WIDTH = 640;
const HEIGHT = 220;
const PAD_LEFT = 52;
const PAD_RIGHT = 12;
const PAD_TOP = 12;
const PAD_BOTTOM = 32;

export default function PortfolioValueChart({ trades, currentTotal }: Props) {
  const points = useMemo(
    () => buildPortfolioChartSeries(trades, currentTotal, 14),
    [trades, currentTotal]
  );

  const { linePath, areaPath, yTicks, xLabels } = useMemo(() => {
    const values = points.map((p) => p.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;

    const coords = points.map((point, index) => {
      const x = PAD_LEFT + (index / Math.max(points.length - 1, 1)) * innerW;
      const y = PAD_TOP + innerH - ((point.value - min) / span) * innerH;
      return { x, y, point };
    });

    const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" ");
    const area = `${line} L ${coords[coords.length - 1]?.x.toFixed(1) ?? PAD_LEFT} ${(PAD_TOP + innerH).toFixed(1)} L ${PAD_LEFT} ${(PAD_TOP + innerH).toFixed(1)} Z`;

    const yTicks = [min, min + span * 0.5, max].map((value) => {
      const y = PAD_TOP + innerH - ((value - min) / span) * innerH;
      return { value, y };
    });

    const labelIndexes = [0, Math.floor((points.length - 1) / 2), points.length - 1];
    const xLabels = labelIndexes.map((index) => ({
      x: coords[index]?.x ?? PAD_LEFT,
      label: formatChartDate(points[index]?.date ?? new Date()),
    }));

    return { linePath: line, areaPath: area, yTicks, xLabels };
  }, [points]);

  return (
    <div className="portfolio-value-chart">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="portfolio-value-chart-svg"
        role="img"
        aria-label="Portfolio value over time"
      >
        {yTicks.map((tick) => (
          <g key={tick.value}>
            <line
              x1={PAD_LEFT}
              y1={tick.y}
              x2={WIDTH - PAD_RIGHT}
              y2={tick.y}
              className="portfolio-value-chart-grid"
            />
            <text x={PAD_LEFT - 8} y={tick.y + 4} className="portfolio-value-chart-axis" textAnchor="end">
              {formatChartValue(tick.value)}
            </text>
          </g>
        ))}

        <path d={areaPath} className="portfolio-value-chart-area" />
        <path d={linePath} className="portfolio-value-chart-line" />

        {xLabels.map((label) => (
          <text
            key={label.label}
            x={label.x}
            y={HEIGHT - 8}
            className="portfolio-value-chart-axis"
            textAnchor="middle"
          >
            {label.label}
          </text>
        ))}
      </svg>
      <p className="babel-chart-caption">
        Estimated from paper trades and current holdings. Starts at $10,000 simulated cash.
      </p>
    </div>
  );
}
