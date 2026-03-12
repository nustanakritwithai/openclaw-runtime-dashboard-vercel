'use client';
import { useMetrics } from '@/hooks/use-metrics';

export default function Dashboard() {
  const { metrics, loading, error, refetch } = useMetrics();

  if (loading && !metrics) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' }}>
        Loading metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '20px' }}>
        <div style={{ color: '#ef4444', fontSize: '18px' }}>Error: {error}</div>
        <button onClick={refetch} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white' }}>
          Retry
        </button>
      </div>
    );
  }

  const memoryPercent = metrics ? (metrics.system.memory_used_mb / metrics.system.memory_total_mb * 100).toFixed(1) : '0';
  const errorRate = metrics ? (metrics.requests.errors / metrics.requests.total * 100).toFixed(2) : '0';
  const uptimeDays = metrics ? (metrics.system.uptime_seconds / 86400).toFixed(1) : '0';

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>
            OpenClaw Runtime Dashboard
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
            Real-time Performance Monitoring
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '30px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>CPU Usage</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{metrics?.system.cpu_percent}%</div>
            <div style={{ marginTop: '12px', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${metrics?.system.cpu_percent}%`, height: '100%', background: '#3b82f6', transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Memory Usage</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{memoryPercent}%</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {metrics?.system.memory_used_mb} / {metrics?.system.memory_total_mb} MB
            </div>
            <div style={{ marginTop: '12px', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${memoryPercent}%`, height: '100%', background: '#10b981', transition: 'width 0.3s' }}></div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Requests</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{metrics?.requests.total.toLocaleString()}</div>
            <div style={{ fontSize: '14px', color: '#10b981', marginTop: '4px' }}>
              ✓ {metrics?.requests.success.toLocaleString()} successful
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Error Rate</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{errorRate}%</div>
            <div style={{ fontSize: '14px', color: '#ef4444', marginTop: '4px' }}>
              ✗ {metrics?.requests.errors} errors
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Avg Response Time</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{metrics?.requests.avg_response_ms}ms</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>milliseconds</div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>System Uptime</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>{uptimeDays}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>days</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={refetch} style={{ padding: '12px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', border: 'none', background: 'white', color: '#667eea', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            Reload Metrics
          </button>
          <div style={{ marginTop: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            Last updated: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleString() : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
