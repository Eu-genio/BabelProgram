namespace Babel.Api.Modules.Market.Application;

public record SymbolSearchResult(string Symbol, string Name);

public static class PopularSymbolCatalog
{
    private static readonly (string Symbol, string Name, int Rank)[] Symbols =
    [
        ("AAPL", "Apple Inc.", 1),
        ("MSFT", "Microsoft Corporation", 2),
        ("NVDA", "NVIDIA Corporation", 3),
        ("AMZN", "Amazon.com Inc.", 4),
        ("GOOGL", "Alphabet Inc.", 5),
        ("META", "Meta Platforms Inc.", 6),
        ("TSLA", "Tesla Inc.", 7),
        ("BRK.B", "Berkshire Hathaway Inc.", 8),
        ("AVGO", "Broadcom Inc.", 9),
        ("JPM", "JPMorgan Chase & Co.", 10),
        ("V", "Visa Inc.", 11),
        ("UNH", "UnitedHealth Group Inc.", 12),
        ("MA", "Mastercard Inc.", 13),
        ("XOM", "Exxon Mobil Corporation", 14),
        ("LLY", "Eli Lilly and Company", 15),
        ("COST", "Costco Wholesale Corporation", 16),
        ("HD", "The Home Depot Inc.", 17),
        ("PG", "Procter & Gamble Company", 18),
        ("JNJ", "Johnson & Johnson", 19),
        ("NFLX", "Netflix Inc.", 20),
        ("AMD", "Advanced Micro Devices Inc.", 21),
        ("INTC", "Intel Corporation", 22),
        ("CRM", "Salesforce Inc.", 23),
        ("ORCL", "Oracle Corporation", 24),
        ("ADBE", "Adobe Inc.", 25),
        ("BAC", "Bank of America Corporation", 26),
        ("KO", "The Coca-Cola Company", 27),
        ("PEP", "PepsiCo Inc.", 28),
        ("DIS", "The Walt Disney Company", 29),
        ("NKE", "NIKE Inc.", 30),
        ("WMT", "Walmart Inc.", 31),
        ("CVX", "Chevron Corporation", 32),
        ("MRK", "Merck & Co. Inc.", 33),
        ("ABBV", "AbbVie Inc.", 34),
        ("TMO", "Thermo Fisher Scientific Inc.", 35),
        ("CSCO", "Cisco Systems Inc.", 36),
        ("ACN", "Accenture plc", 37),
        ("MCD", "McDonald's Corporation", 38),
        ("LIN", "Linde plc", 39),
        ("QCOM", "QUALCOMM Incorporated", 40),
        ("TXN", "Texas Instruments Incorporated", 41),
        ("IBM", "International Business Machines", 42),
        ("GE", "GE Aerospace", 43),
        ("AMAT", "Applied Materials Inc.", 44),
        ("NOW", "ServiceNow Inc.", 45),
        ("INTU", "Intuit Inc.", 46),
        ("UBER", "Uber Technologies Inc.", 47),
        ("PYPL", "PayPal Holdings Inc.", 48),
        ("SHOP", "Shopify Inc.", 49),
        ("SQ", "Block Inc.", 50),
    ];

    public static IReadOnlyList<SymbolSearchResult> Search(string query, int limit = 3)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return [];
        }

        var normalized = query.Trim().ToUpperInvariant();

        return Symbols
            .Where(s =>
                s.Symbol.StartsWith(normalized, StringComparison.Ordinal) ||
                s.Name.Contains(normalized, StringComparison.OrdinalIgnoreCase))
            .OrderBy(s => s.Symbol.StartsWith(normalized, StringComparison.Ordinal) ? 0 : 1)
            .ThenBy(s => s.Rank)
            .Take(limit)
            .Select(s => new SymbolSearchResult(s.Symbol, s.Name))
            .ToList();
    }
}
