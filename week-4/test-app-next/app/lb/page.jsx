'use client'
import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, TrendingUp } from 'lucide-react';

export default function LoadBalancerDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch stats from backend every second
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 1000);
    return () => clearInterval(interval);
  }, []);

  // Send test request to load balancer
  const sendRequest = async () => {
    setIsProcessing(true);
    const requestData = {
      data: `Request-${Date.now()}`,
    };

    try {
      const response = await fetch('http://127.0.0.1:8080/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      
      setRequests(prev => [
        {
          id: result.request_id,
          nodeId: result.node_id,
          result: result.result,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 9), // Keep last 10 requests
      ]);
    } catch (error) {
      console.error('Request failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate max requests for visualization scaling
  const maxRequests = stats?.nodes.reduce(
    (max, node) => Math.max(max, node.total_requests),
    1
  ) || 1;

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Connecting to load balancer...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Zap className="text-yellow-400" />
            Load Balancer Monitor
          </h1>
          <p className="text-slate-300">Real-time distributed system visualization</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Active Nodes</p>
                <p className="text-4xl font-bold text-white mt-1">
                  {stats.active_nodes}
                </p>
              </div>
              <Server className="text-green-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Requests</p>
                <p className="text-4xl font-bold text-white mt-1">
                  {stats.total_requests}
                </p>
              </div>
              <TrendingUp className="text-blue-400" size={40} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Nodes</p>
                <p className="text-4xl font-bold text-white mt-1">
                  {stats.nodes.length}
                </p>
              </div>
              <Activity className="text-purple-400" size={40} />
            </div>
          </div>
        </div>

        {/* Node Visualization */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Worker Nodes</h2>
          
          {stats.nodes.length === 0 ? (
            <div className="text-center py-12">
              <Server className="mx-auto mb-4 text-slate-400" size={48} />
              <p className="text-slate-300 text-lg mb-2">No nodes connected</p>
              <p className="text-slate-400 text-sm">
                Start a worker node: <code className="bg-black/30 px-2 py-1 rounded">cargo run --bin node -- --port 3001</code>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    node.is_healthy
                      ? 'bg-green-500/10 border-green-400'
                      : 'bg-red-500/10 border-red-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          node.is_healthy ? 'bg-green-400' : 'bg-red-400'
                        } animate-pulse`}
                      />
                      <span className="text-white font-bold">{node.id}</span>
                      <span className="text-slate-400 text-sm">{node.address}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{node.total_requests} requests</p>
                      <p className="text-slate-400 text-sm">
                        {node.active_requests} active
                      </p>
                    </div>
                  </div>

                  {/* Load bar visualization */}
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{
                        width: `${(node.total_requests / maxRequests) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Test Request Button */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Test Load Balancer</h2>
          <button
            onClick={sendRequest}
            disabled={isProcessing || stats.active_nodes === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Send Test Request'}
          </button>
        </div>

        {/* Recent Requests */}
        {requests.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Requests</h2>
            <div className="space-y-2">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white/5 p-3 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-mono text-sm">{req.id.slice(0, 8)}...</p>
                      <p className="text-slate-400 text-sm">
                        Handled by: <span className="text-green-400">{req.nodeId}</span>
                      </p>
                    </div>
                    <span className="text-slate-400 text-xs">{req.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-sm mt-2">{req.result}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}