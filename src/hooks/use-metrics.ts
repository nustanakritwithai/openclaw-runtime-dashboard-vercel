'use client';

import { useState, useEffect } from 'react';

interface SystemMetrics {
  cpu_percent: number;
  memory_used_mb: number;
  memory_total_mb: number;
  uptime_seconds: number;
}

interface RequestMetrics {
  total: number;
  success: number;
  errors: number;
  avg_response_ms: number;
}

interface Metrics {
  timestamp: string;
  system: SystemMetrics;
  requests: RequestMetrics;
}

export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/metrics.json');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setMetrics(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, loading, error, refetch: fetchMetrics };
}
