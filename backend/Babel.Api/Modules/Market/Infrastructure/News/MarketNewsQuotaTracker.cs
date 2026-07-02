namespace Babel.Api.Modules.Market.Infrastructure;

/// <summary>
/// Tracks Marketaux API usage per UTC day so the free tier budget is shared across all users.
/// </summary>
public class MarketNewsQuotaTracker
{
    private readonly int _maxDailyRequests;
    private readonly object _lock = new();
    private DateOnly _day = DateOnly.FromDateTime(DateTime.UtcNow);
    private int _count;

    public MarketNewsQuotaTracker(IConfiguration configuration)
    {
        _maxDailyRequests = configuration.GetValue("Marketaux:MaxDailyRequests", 95);
    }

    public bool TryConsume()
    {
        lock (_lock)
        {
            ResetIfNewDay();
            if (_count >= _maxDailyRequests)
            {
                return false;
            }

            _count++;
            return true;
        }
    }

    public int Remaining
    {
        get
        {
            lock (_lock)
            {
                ResetIfNewDay();
                return Math.Max(0, _maxDailyRequests - _count);
            }
        }
    }

    private void ResetIfNewDay()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (today != _day)
        {
            _day = today;
            _count = 0;
        }
    }
}
