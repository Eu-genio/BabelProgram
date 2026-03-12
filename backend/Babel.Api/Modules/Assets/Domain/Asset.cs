namespace Babel.Api.Modules.Assets.Domain
{
    public class Asset
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public AssetType Type { get; set; }
        public string Exchange { get; set; } = null!;
        public string Currency { get; set; } = "USD";
        public bool IsActive { get; set; } = true;
    }
}
