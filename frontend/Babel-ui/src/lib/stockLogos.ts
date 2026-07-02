const SYMBOL_DOMAINS: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  NVDA: "nvidia.com",
  AMZN: "amazon.com",
  GOOGL: "google.com",
  GOOG: "google.com",
  META: "meta.com",
  TSLA: "tesla.com",
  AMD: "amd.com",
  INTC: "intel.com",
  NFLX: "netflix.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  MA: "mastercard.com",
  DIS: "disney.com",
  BA: "boeing.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  WMT: "walmart.com",
  COST: "costco.com",
  CRM: "salesforce.com",
  ORCL: "oracle.com",
  ADBE: "adobe.com",
  IBM: "ibm.com",
  QCOM: "qualcomm.com",
  AVGO: "broadcom.com",
  PYPL: "paypal.com",
  SHOP: "shopify.com",
  UBER: "uber.com",
};

export function getStockLogoUrl(symbol: string): string | null {
  const domain = SYMBOL_DOMAINS[symbol.trim().toUpperCase()];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}

export function getStockInitial(symbol: string): string {
  return symbol.trim().charAt(0).toUpperCase() || "?";
}
