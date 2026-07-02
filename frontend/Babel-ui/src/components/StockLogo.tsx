import { useState } from "react";
import { getStockInitial, getStockLogoUrl } from "../lib/stockLogos";
import "./StockLogo.css";

type Props = {
  symbol: string;
  size?: number;
  className?: string;
};

function faviconUrl(symbol: string): string | null {
  const domain = getStockLogoUrl(symbol)?.replace("https://logo.clearbit.com/", "");
  return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
}

export default function StockLogo({ symbol, size = 32, className = "" }: Props) {
  const [stage, setStage] = useState<"clearbit" | "favicon" | "initial">("clearbit");
  const logoUrl = getStockLogoUrl(symbol);
  const classes = `stock-logo ${className}`.trim();

  if (!logoUrl || stage === "initial") {
    return (
      <div
        className={classes}
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        aria-hidden="true"
      >
        {getStockInitial(symbol)}
      </div>
    );
  }

  const src = stage === "clearbit" ? logoUrl : faviconUrl(symbol) ?? logoUrl;

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={classes}
      loading="lazy"
      onError={() => {
        if (stage === "clearbit") {
          setStage("favicon");
          return;
        }
        setStage("initial");
      }}
    />
  );
}
