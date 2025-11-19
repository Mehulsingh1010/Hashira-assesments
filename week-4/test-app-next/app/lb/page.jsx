'use client'
import React, { useState, useEffect } from 'react';
import { Activity, Server, Zap, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

export default function LoadBalancerDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSize, setBatchSize] = useState(1);

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
    const interval = setInterval(fetchStats, 500);
    return () => clearInterval(interval);
  }, []);

  const sendRequests = async () => {
    setIsProcessing(true);
    
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
          {
            id: result.request_id,
            nodeId: result.node_id,
            result: result.result,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 14),
        ]);

        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    }
    
    setIsProcessing(false);
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative text-center z-10">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-6" />
          <div className="text-2xl font-bold text-white mb-3">Connecting to load balancer...</div>
          <div className="text-slate-400 text-base">Make sure the server is running on port 8080</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-x-hidden relative">
      <div className="fixed inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-cyan-600"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          

          {/* Network Topology */}
          <div className="rounded-2xl p-8 md:p-12 border border-slate-700 bg-slate-800/50 backdrop-blur mb-12 shadow-xl animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="text-3xl font-bold text-white mb-12 flex items-center gap-3">
              <Activity className="text-cyan-400" size={32} />
              Network Topology
            </h2>
            
            {stats.nodes.length === 0 ? (
              <div className="text-center py-24">
                <Server className="text-slate-600 mx-auto mb-6" size={80} />
                <p className="text-white text-2xl mb-4 font-bold">No worker nodes connected</p>
                <p className="text-slate-400 mb-8">Start workers to see the network</p>
                <code className="bg-slate-900 px-6 py-3 rounded-lg text-cyan-400 inline-block text-sm border border-slate-700">
                  cargo run --bin node -- --port 3001
                </code>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Load Balancer */}
                <div className="flex justify-center mb-8 animate-slide-down">
                  <div className="relative group perspective">
                    <div className="bg-gradient-to-b from-cyan-500/20 to-blue-500/10 rounded-lg p-8 border border-cyan-500/50 backdrop-blur hover:border-cyan-400 transition-all group-hover:shadow-lg group-hover:shadow-cyan-500/30 group-hover:scale-105 duration-300" style={{ perspective: '1000px', transform: 'rotateX(5deg)' }}>
                      <div className="text-center">
                        <div className="inline-flex p-3 bg-cyan-500/20 rounded-lg mb-3">
                          <Zap className="text-cyan-400" size={32} />
                        </div>
                        <div className="text-white font-bold text-2xl tracking-wider mb-1">LOAD BALANCER</div>
                        <div className="text-slate-400 text-sm font-mono">Port 8080</div>
                        <div className="bg-slate-900/50 border border-slate-600 rounded-lg mt-4 px-4 py-3">
                          <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">Total Distributed</div>
                          <div className="text-cyan-400 text-2xl font-bold">{stats.total_requests}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 overflow-x-auto pb-4">
                  {stats.nodes.map((node, index) => {
                    const healthColor = node.is_healthy 
                      ? 'border-emerald-500/60 hover:border-emerald-400' 
                      : 'border-red-500/60 hover:border-red-400';
                    
                    return (
                      <React.Fragment key={node.id}>
                        <div className="group animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                          <div className={`relative rounded-lg p-6 border-2 backdrop-blur transition-all duration-300 hover:scale-105 w-72 bg-slate-800/50 hover:bg-slate-800/80 shadow-lg hover:shadow-xl hover:shadow-cyan-500/20 ${healthColor}`}>
                            {/* Health indicator */}
                            <div className="absolute -top-3 -right-3 z-20">
                              <div className={`w-8 h-8 rounded-full animate-pulse border-3 border-slate-800 ${node.is_healthy ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}></div>
                            </div>

                            <div className="flex items-start gap-3 mb-4">
                              <div className="p-2 rounded-lg bg-slate-700">
                                <Server className="text-cyan-400" size={24} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white font-bold text-base truncate">{node.id}</div>
                                <div className="text-slate-400 text-xs truncate font-mono">{node.address}</div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Total</div>
                                <div className="text-cyan-400 font-bold text-lg">{node.total_requests}</div>
                              </div>
                              <div className="bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700">
                                <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active</div>
                                <div className="text-blue-400 font-bold text-lg">{node.active_requests}</div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-700 rounded-full"
                                style={{
                                  width: `${Math.min((node.total_requests / (stats.total_requests || 1)) * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <div className="text-slate-400 text-xs mt-2 text-right font-semibold">
                              {((node.total_requests / (stats.total_requests || 1)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Arrow between nodes */}
                        {index < stats.nodes.length - 1 && (
                          <div className="flex items-center animate-pulse">
                            <ArrowRight className="text-slate-500" size={24} />
                          </div>
                        )}

                        {/* Null pointer at end */}
                        {index === stats.nodes.length - 1 && (
                          <div className="flex items-center ml-2">
                            <div className="bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 font-mono text-slate-400 font-semibold">
                              null
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Test Request Sender */}
          <div className="rounded-2xl p-8 md:p-12 border border-slate-700 bg-slate-800/50 backdrop-blur mb-12 shadow-xl animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Zap className="text-cyan-400" size={32} />
              Test Requests
            </h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <label className="text-white font-bold">Number of requests:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={batchSize}
                onChange={(e) => setBatchSize(parseInt(e.target.value) || 1)}
                className="bg-slate-900/50 text-white text-lg border border-slate-600 rounded-lg px-4 py-2 w-32 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
              />
            </div>

            <button
              onClick={sendRequests}
              disabled={isProcessing || stats.active_nodes === 0}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-gray-900 font-bold text-lg py-4 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-cyan-500/40 disabled:hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-all duration-300"></div>
              <div className="relative flex items-center gap-3">
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
              </div>
            </button>

            {stats.active_nodes === 0 && (
              <p className="text-white text-base mt-6 text-center font-semibold bg-red-500/20 border border-red-500/50 rounded-lg py-3">
                No active nodes available. Start a worker first!
              </p>
            )}
          </div>

          {/* Request History */}
          {requests.length > 0 && (
            <div className="rounded-2xl p-8 md:p-12 border border-slate-700 bg-slate-800/50 backdrop-blur shadow-xl animate-fade-in" style={{ animationDelay: '900ms' }}>
              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Activity className="text-emerald-400" size={32} />
                Request History
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-3">
                {requests.map((req, idx) => (
                  <div
                    key={req.id}
                    className={`bg-gradient-to-r p-4 rounded-lg border backdrop-blur transition-all hover:scale-[1.02] animate-slide-in ${
                      idx === 0 
                        ? 'from-emerald-500/20 to-cyan-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/20' 
                        : 'from-slate-800/60 to-slate-800/40 border-slate-700 hover:border-cyan-500/50'
                    }`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <code className="text-cyan-400 font-mono text-sm bg-cyan-500/20 px-3 py-1 rounded border border-cyan-500/50">
                          {req.id.slice(0, 8)}
                        </code>
                        <ArrowRight className="text-slate-500" size={16} />
                        <span className="text-cyan-400 font-bold text-base">{req.nodeId}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-mono">{req.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-sm font-mono bg-slate-900/30 p-2 rounded border border-slate-700">{req.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.5s ease-out forwards; }
        .animate-slide-in { animation: slide-in 0.4s ease-out forwards; }
        .perspective { perspective: 1000px; }
      `}</style>
    </div>
  );
}
