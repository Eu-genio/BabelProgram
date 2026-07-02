namespace Babel.Api.Modules.Assets.Domain
{
    public class Asset
    {
        public int Id { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public AssetType Type { get; set; }
        public string Exchange { get; set; } = null!;
        public string Currency { get; set; } = "USD";
        public bool IsActive { get; set; } = true;
    }
}
