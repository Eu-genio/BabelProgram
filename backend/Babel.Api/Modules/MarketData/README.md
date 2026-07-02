# MarketData module

Internal quote adapter for trade execution and portfolio valuation.

## Purpose

`MarketData` exposes `IMarketDataProvider.GetQuoteAsync(symbol)` to **Trades** and related flows. It does not serve the market UI directly.

Implementation (`MarketViewMarketDataProvider`) forwards to `IMarketViewProvider` from the **Market** module so all pricing uses the same Finnhub-backed cache and parsing.

## Folder layout

```
MarketData/
  Api/              Optional HTTP surface for quotes
  Application/      `MarketDataService`, `IMarketDataProvider`
  Domain/           `AssetQuote` model
  Infrastructure/   Adapter to Market quotes
```

See `Modules/Market/README.md` for the user-facing market features (charts, news, movers).
