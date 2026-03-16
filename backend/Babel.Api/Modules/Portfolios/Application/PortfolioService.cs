using Babel.Api.Modules.Portfolios.Domain;
    using Babel.Api.Modules.Portfolios.Infrastructure;


namespace Babel.Api.Modules.Portfolios.Application
{
    public class PortfolioService
    {
        private readonly PortfolioRepository _repo;

        public PortfolioService(PortfolioRepository repo)
        {
            _repo = repo;
        }

        public Task<List<Portfolio>> GetUserPortfolioAsync(int userId)
        {
            return _repo.GetByUserIdAsync(userId);
        }

        public async Task<Portfolio> CreatePortfolioAsync(int userId, string name)
        {
            var portfolio = new Portfolio
            {
                UserId = userId,
                Name = name,
                CashBalance = 10000m
            };

            await _repo.AddAsync(portfolio);

            return portfolio;
        }

    }
}
