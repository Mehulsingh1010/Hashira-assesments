'use client'
import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, ArrowRight, Loader2, TrendingUp, Circle } from 'lucide-react';

export default function LoadBalancerDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSize, setBatchSize] = useState(1);
  const [parallelMode, setParallelMode] = useState(true);

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
    const interval = setInterval(fetchStats, 200);
    return () => clearInterval(interval);
  }, []);

  const sendRequests = async () => {
    setIsProcessing(true);
    
    if (parallelMode) {
      // PARALLEL MODE: Send all requests at once (fast)
      const promises = [];
      for (let i = 0; i < batchSize; i++) {
        const requestData = {
          data: `Task-${Date.now()}-${i}`,
        };

        promises.push(
          fetch('http://127.0.0.1:8080/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          })
            .then(response => response.json())
            .then(result => ({
              id: result.request_id,
              nodeId: result.node_id,
              result: result.result,
              timestamp: new Date().toLocaleTimeString(),
            }))
            .catch(error => {
              console.error('Request failed:', error);
              return null;
            })
        );
      }
      
      // Wait for all requests to complete
      const results = await Promise.all(promises);
      
      // Add all successful results at once
      const successfulResults = results.filter(r => r !== null);
      setRequests(prev => [...prev, ...successfulResults].slice(-10));
      
    } else {
      // SEQUENTIAL MODE: Send one at a time (visual counting)
      for (let i = 0; i < batchSize; i++) {
        const requestData = {
          data: `Task-${Date.now()}-${i}`,
        };

        try {
          const response = await fetch('http://127.0.0.1:8080/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
          });

          const result = await response.json();
          
          setRequests(prev => [
            ...prev,
            {
              id: result.request_id,
              nodeId: result.node_id,
              result: result.result,
              timestamp: new Date().toLocaleTimeString(),
            },
          ].slice(-10));

          // Small delay between requests for visual effect
          if (i < batchSize - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          console.error('Request failed:', error);
        }
      }
    }
    
    setIsProcessing(false);
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
          <div className="text-xl font-semibold text-white mb-2">Connecting to Load Balancer...</div>
          <div className="text-slate-400 text-sm">Make sure the server is running on port 8080</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="text-cyan-500" size={40} />
            Load Balancer Dashboard
          </h1>
          <p className="text-slate-400">Real-time monitoring and request distribution</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Requests</span>
              <TrendingUp className="text-cyan-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{stats.total_requests}</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Active Nodes</span>
              <Server className="text-emerald-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{stats.active_nodes}</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">Total Nodes</span>
              <Server className="text-blue-500" size={20} />
            </div>
            <div className="text-3xl font-bold text-white">{stats.nodes.length}</div>
          </div>
        </div>

        {/* Network Flow Diagram */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-cyan-500" size={28} />
            Network Flow
          </h2>
          
          {stats.nodes.length === 0 ? (
            <div className="text-center py-16">
              <Server className="text-slate-700 mx-auto mb-4" size={64} />
              <p className="text-slate-400 text-lg mb-4">No worker nodes connected</p>
              <p className="text-slate-500 text-sm mb-6">Start a worker to see the network topology</p>
              <code className="bg-slate-800 px-4 py-2 rounded-lg text-cyan-400 text-sm border border-slate-700">
                cargo run --bin node -- --port 3001
              </code>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Load Balancer (Top) */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-xl p-6 w-80">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Zap className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Load Balancer</div>
                      <div className="text-slate-400 text-xs font-mono">Port 8080</div>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Total Distributed</div>
                    <div className="text-cyan-400 text-2xl font-bold">{stats.total_requests}</div>
                  </div>
                </div>
              </div>

              {/* Arrow Down */}
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-0.5 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                  <div className="text-cyan-500">▼</div>
                </div>
              </div>

              {/* Round-Robin Label */}
              <div className="text-center">
                <span className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-slate-300">
                  Round-Robin Distribution
                </span>
              </div>

              {/* Worker Nodes (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {stats.nodes.map((node, index) => {
                  const isHealthy = node.is_healthy;
                  const loadPercentage = stats.total_requests > 0 
                    ? (node.total_requests / stats.total_requests * 100).toFixed(1)
                    : 0;
                  
                  return (
                    <div
                      key={node.id}
                      className={`bg-slate-800/50 border-2 rounded-xl p-5 transition-all hover:scale-105 ${
                        isHealthy 
                          ? 'border-emerald-500/50 hover:border-emerald-500' 
                          : 'border-red-500/50 hover:border-red-500'
                      }`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Server className={isHealthy ? 'text-emerald-400' : 'text-red-400'} size={20} />
                          <div>
                            <div className="text-white font-bold text-sm">{node.id}</div>
                            <div className="text-slate-500 text-xs font-mono">{node.address.replace('http://127.0.0.1:', ':')}</div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          isHealthy 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          <Circle className={`w-2 h-2 ${isHealthy ? 'fill-emerald-400' : 'fill-red-400'}`} />
                          {isHealthy ? 'Healthy' : 'Down'}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700">
                          <div className="text-slate-400 text-xs mb-1">Total</div>
                          <div className="text-cyan-400 font-bold text-lg">{node.total_requests}</div>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-2.5 border border-slate-700">
                          <div className="text-slate-400 text-xs mb-1">Active</div>
                          <div className="text-blue-400 font-bold text-lg">{node.active_requests}</div>
                        </div>
                      </div>

                      {/* Load Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-400 text-xs">Load Distribution</span>
                          <span className="text-slate-300 text-xs font-semibold">{loadPercentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${loadPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Request Sender */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="text-cyan-500" size={28} />
            Send Test Requests
          </h2>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <label className="text-slate-300 font-medium">Number of requests:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
              className="bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 w-32 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            />
          </div>

          {/* Parallel Mode Toggle */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <button
              onClick={() => setParallelMode(!parallelMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                parallelMode ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  parallelMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div>
              <div className="text-white font-medium text-sm">
                {parallelMode ? 'Parallel Mode' : 'Sequential Mode'}
              </div>
              <div className="text-slate-400 text-xs">
                {parallelMode 
                  ? '⚡ Send all requests at once (fast)' 
                  : '🔢 Send one at a time (watch counting)'}
              </div>
            </div>
          </div>

          <button
            onClick={sendRequests}
            disabled={isProcessing || stats.active_nodes === 0}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 disabled:hover:shadow-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Send {batchSize} Request{batchSize > 1 ? 's' : ''}</span>
              </>
            )}
          </button>

          {stats.active_nodes === 0 && (
            <div className="mt-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-center">
              <p className="text-red-400 text-sm font-medium">
                ⚠️ No active nodes available. Start a worker first!
              </p>
            </div>
          )}
        </div>

        {/* Request History */}
        {requests.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-emerald-500" size={28} />
              Recent Requests
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {requests.slice().reverse().map((req, idx) => {
                const actualIndex = requests.length - 1 - idx;
                return (
                  <div
                    key={req.id}
                    className={`bg-slate-800/50 border rounded-lg p-4 transition-all hover:bg-slate-800 ${
                      actualIndex === requests.length - 1
                        ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                        : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className="text-cyan-400 font-mono text-xs bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">
                          {req.id.slice(0, 8)}
                        </code>
                        <ArrowRight className="text-slate-600" size={14} />
                        <span className="text-emerald-400 font-semibold text-sm">{req.nodeId}</span>
                      </div>
                      <span className="text-slate-500 text-xs font-mono">{req.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-sm font-mono bg-slate-900/50 p-2 rounded border border-slate-700">
                      {req.result}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}