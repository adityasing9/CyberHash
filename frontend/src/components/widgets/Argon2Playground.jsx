import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Argon2Playground() {
  const [params, setParams] = useState({
    time_cost: 2,
    memory_cost: 102400, // 100MB
    parallelism: 8
  });
  
  const [resultTime, setResultTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('demo_password');

  const testParams = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/argon2-playground', {
        password,
        ...params
      });
      setResultTime(res.data.time_ms);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Debounced auto-test when params change
  useEffect(() => {
    const timer = setTimeout(() => {
      testParams();
    }, 1000);
    return () => clearTimeout(timer);
  }, [params]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Layers className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold">Argon2 Tuning</h3>
        </div>
        {resultTime && (
          <div className="bg-white/10 px-3 py-1 rounded-full text-sm font-mono flex items-center gap-2">
            {loading ? <Activity className="w-4 h-4 animate-spin text-purple-400" /> : <Activity className="w-4 h-4 text-purple-400" />}
            {resultTime.toFixed(1)} ms
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Time Cost */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Time Cost (Iterations)</span>
            <span className="font-mono">{params.time_cost}</span>
          </div>
          <input 
            type="range" min="1" max="10" step="1"
            className="w-full accent-purple-500"
            value={params.time_cost}
            onChange={(e) => setParams({...params, time_cost: parseInt(e.target.value)})}
          />
        </div>

        {/* Memory Cost */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Memory Cost (KB)</span>
            <span className="font-mono">{(params.memory_cost / 1024).toFixed(0)} MB</span>
          </div>
          <input 
            type="range" min="10240" max="512000" step="10240"
            className="w-full accent-purple-500"
            value={params.memory_cost}
            onChange={(e) => setParams({...params, memory_cost: parseInt(e.target.value)})}
          />
        </div>

        {/* Parallelism */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/70">Parallelism (Threads)</span>
            <span className="font-mono">{params.parallelism}</span>
          </div>
          <input 
            type="range" min="1" max="16" step="1"
            className="w-full accent-purple-500"
            value={params.parallelism}
            onChange={(e) => setParams({...params, parallelism: parseInt(e.target.value)})}
          />
        </div>
        
        <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl">
          <p className="text-xs text-purple-200">
            <strong>Insight:</strong> Increasing memory cost (RAM usage) makes the hash highly resistant to GPU/ASIC cracking. Time cost increases execution time, thwarting brute-force guessing.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
