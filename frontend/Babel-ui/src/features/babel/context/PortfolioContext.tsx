import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError } from "../../../lib/api/client";
import {
  getDashboard,
  getMyPortfolios,
  type PortfolioDashboardResponse,
  type PortfolioResponse,
} from "../../../lib/api/portfolioApi";

type PortfolioContextValue = {
  portfolios: PortfolioResponse[];
  selectedPortfolioId: number | null;
  setSelectedPortfolioId: (id: number) => void;
  data: PortfolioDashboardResponse | null;
  loading: boolean;
  error: string | null;
  refreshPortfolios: (preferredId?: number | null) => Promise<void>;
  refreshDashboard: () => Promise<void>;
};

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolios, setPortfolios] = useState<PortfolioResponse[]>([]);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<number | null>(null);
  const [data, setData] = useState<PortfolioDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPortfolios = useCallback(async (preferredId?: number | null) => {
    const fetched = await getMyPortfolios();
    setPortfolios(fetched);

    if (fetched.length === 0) {
      setSelectedPortfolioId(null);
      setData(null);
      return;
    }

    setSelectedPortfolioId((current) => {
      if (preferredId && fetched.some((p) => p.id === preferredId)) return preferredId;
      if (current && fetched.some((p) => p.id === current)) return current;
      return fetched[0].id;
    });
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (selectedPortfolioId === null) {
      setData(null);
      return;
    }

    const dashboard = await getDashboard(selectedPortfolioId);
    setData(dashboard);
  }, [selectedPortfolioId]);

  useEffect(() => {
    async function initialLoad() {
      try {
        setLoading(true);
        setError(null);
        await refreshPortfolios();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load portfolios.");
      } finally {
        setLoading(false);
      }
    }

    void initialLoad();
  }, [refreshPortfolios]);

  useEffect(() => {
    if (selectedPortfolioId === null) {
      setData(null);
      return;
    }

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        await refreshDashboard();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, [selectedPortfolioId, refreshDashboard]);

  const value = useMemo(
    () => ({
      portfolios,
      selectedPortfolioId,
      setSelectedPortfolioId,
      data,
      loading,
      error,
      refreshPortfolios,
      refreshDashboard,
    }),
    [portfolios, selectedPortfolioId, data, loading, error, refreshPortfolios, refreshDashboard]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within PortfolioProvider");
  }
  return context;
}
