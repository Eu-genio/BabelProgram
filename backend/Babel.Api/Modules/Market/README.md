# Market module

User-facing market data for the Babel trading UI: watchlists, top movers, charts, symbol search, and news.

## Folder layout

```
Market/
  Api/                         HTTP endpoints (`MarketController`)
  Application/
    Abstractions/              Ports and service contracts (I* interfaces)
    Services/                  Use cases (`MarketViewService`, `NewsService`)
    Helpers/                   Static utilities (`PopularSymbolCatalog`, `NewsAggregation`)
  Domain/                      Shared models (`MarketQuote`, `MarketNewsItem`, ...)
  Infrastructure/
    Quotes/                    Live quote providers (Finnhub, Yahoo snapshots)
    Charts/                    Historical chart providers (Yahoo)
    News/                      News providers (Yahoo, Marketaux) and quota tracking
```

## Market vs MarketData

| Module | Purpose |
|--------|---------|
| **Market** | Powers `/api/market` and portfolio news: watchlists, movers, charts, search, news feeds. |
| **MarketData** | Thin adapter used by **trades** and **portfolios** for a single quote at execution time. It delegates to `IMarketViewProvider` so pricing shares the same Finnhub cache as the Market module. |

If `MarketData` stays a one-file adapter, it could be merged into `Market` later. For now it keeps trade pricing separate from the richer market UI surface.

## Adding a new external provider

1. Add the implementation under the matching `Infrastructure/*` folder.
2. If it replaces a port, implement the interface in `Application/Abstractions/`.
3. Register the type in `Program.cs`.
4. Prefer caching in the service layer (`NewsService`) rather than in controllers.
