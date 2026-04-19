"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, ShieldCheck, Database, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type Transaction = {
  transaction_id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  merchant: string;
  location: string;
  velocity: number;
  is_fraud: boolean;
};

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Transaction[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Initial fetch
    fetch("http://localhost:8000/api/transactions/recent")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTransactions(data);
      })
      .catch(console.error);

    fetch("http://localhost:8000/api/alerts/recent")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAlerts(data);
      })
      .catch(console.error);

    // WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/ws/stream");

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    
    ws.onmessage = (event) => {
      const data: Transaction = JSON.parse(event.data);
      setTransactions(prev => [data, ...prev].slice(0, 50));
      
      setChartData(prev => {
        const newPoint = { time: new Date().toLocaleTimeString(), amount: data.amount };
        return [...prev, newPoint].slice(-20);
      });

      if (data.is_fraud) {
        setAlerts(prev => [data, ...prev].slice(0, 20));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="min-h-screen bg-super-dark text-foreground p-6 selection:bg-primary/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center justify-between glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center p-3 bg-primary/20 rounded-xl">
              <ShieldCheck className="w-8 h-8 text-primary" />
              {isConnected && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-primary rounded-full animate-pulse glow-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Nexus AI Fraud Vanguard
              </h1>
              <p className="text-sm text-gray-500">Real-time Anomaly Detection Engine</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">{transactions.length} Processed Event{transactions.length !== 1 && 's'}</span>
            </div>
            <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-2 border-red-500/30">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-100">{alerts.length} Threats Prevented</span>
            </div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Feed (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5 text-gray-400" />
                  Live Transaction Stream
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <RefreshCw className={`w-3 h-3 ${isConnected ? 'animate-spin' : ''}`} />
                  {isConnected ? 'Connected to Kafka' : 'Disconnected'}
                </div>
              </div>

              {/* Chart */}
              <div style={{ width: '100%', height: 250 }} className="mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} />
                    <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* List of general transactions */}
            <div className="glass-panel p-6 rounded-2xl h-[400px] overflow-hidden flex flex-col">
              <h2 className="text-lg font-semibold mb-4 text-gray-300">Recent Ledger Activity</h2>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                <AnimatePresence initial={false}>
                  {transactions.map((tx, idx) => (
                    <motion.div
                      key={`${tx.transaction_id}-${idx}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg flex items-center justify-between border ${
                        tx.is_fraud 
                          ? 'bg-red-500/10 border-red-500/20' 
                          : 'bg-white/5 border-white/5'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">{tx.user_id}</span>
                        <span className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${tx.is_fraud ? 'text-red-400' : 'text-primary'}`}>
                          ${tx.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{tx.merchant}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Alerts Sidebar (Right Column) */}
          <div className="glass-panel p-6 rounded-2xl h-[824px] flex flex-col border-red-500/20 glow-red">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-red-500 glow-text-red">
              <AlertTriangle className="w-6 h-6" />
              Critical Alerts
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    No anomalies detected yet
                  </div>
                ) : (
                  alerts.map((alert, idx) => (
                    <motion.div
                      key={`alert-${alert.transaction_id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                      
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-lg font-bold text-red-400">
                          ${alert.amount.toFixed(2)}
                        </span>
                        <span className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded-full border border-red-500/30">
                          AI Flagged
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-500">User</span>
                          <span className="font-mono">{alert.user_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Merchant</span>
                          <span>{alert.merchant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Velocity</span>
                          <span>{alert.velocity} tx / 10m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time</span>
                          <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
