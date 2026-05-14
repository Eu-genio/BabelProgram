const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(value);
}

const dateTimeUtcFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "medium",
  timeZone: "UTC",
});

export function formatDateTimeUtc(isoOrMs: string | number | Date): string {
  const d = typeof isoOrMs === "string" || typeof isoOrMs === "number" ? new Date(isoOrMs) : isoOrMs;
  if (Number.isNaN(d.getTime())) {
    return "—";
  }
  return `${dateTimeUtcFormatter.format(d)} UTC`;
}
