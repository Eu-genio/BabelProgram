const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEmptyValue(): string {
  return "N/A";
}

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
    return formatEmptyValue();
  }
  return `${dateTimeUtcFormatter.format(d)} UTC`;
}

export function formatRelativeTime(isoOrMs: string | number | Date): string {
  const d = typeof isoOrMs === "string" || typeof isoOrMs === "number" ? new Date(isoOrMs) : isoOrMs;
  if (Number.isNaN(d.getTime())) {
    return formatEmptyValue();
  }

  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return dateTimeUtcFormatter.format(d);
}

export function formatVolume(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return formatEmptyValue();
  }

  return new Intl.NumberFormat("en-US", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSignedCurrency(value: number): string {
  const formatted = currencyFormatter.format(Math.abs(value));
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

export function formatSignedPercent(value: number): string {
  const formatted = `${Math.abs(value).toFixed(2)}%`;
  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function quoteColorClass(value: number): string {
  if (value > 0) return "market-up";
  if (value < 0) return "market-down";
  return "";
}

export function colorClassForValue(value: number): string {
  return quoteColorClass(value);
}
