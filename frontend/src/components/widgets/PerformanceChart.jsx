import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PerformanceChart() {
  const [data, setData] = useState([
    { name: 'SHA-256', time: 0, color: '#004B23' },
    { name: 'SHA-384', time: 0, color: '#006400' },
    { name: 'SHA-512', time: 0, color: '#007200' },
    { name: 'SHA-3', time: 0, color: '#008000' },
    { name: 'BLAKE2', time: 0, color: '#38B000' },
    { name: 'BLAKE3', time: 0, color: '#70E000' },
    { name: 'bcrypt', time: 0, color: '#9EF01A' },
    { name: 'Argon2', time: 0, color: '#CCFF33' },
    { name: 'scrypt', time: 0, color: '#39FF14' }
  ]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const runBenchmark = async () => {
    if(!password) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/compare', { password });
      
      setData([
        { name: 'SHA-256', time: res.data.sha256, color: '#004B23' },
        { name: 'SHA-384', time: res.data.sha384, color: '#006400' },
        { name: 'SHA-512', time: res.data.sha512, color: '#007200' },
        { name: 'SHA-3', time: res.data.sha3_256, color: '#008000' },
        { name: 'BLAKE2', time: res.data.blake2, color: '#38B000' },
        { name: 'BLAKE3', time: res.data.blake3, color: '#70E000' },
        { name: 'bcrypt', time: res.data.bcrypt, color: '#9EF01A' },
        { name: 'Argon2', time: res.data.argon2, color: '#CCFF33' },
        { name: 'scrypt', time: res.data.scrypt, color: '#39FF14' }
      ]);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-white/10 p-3 rounded-lg backdrop-blur-md shadow-xl">
          <p className="text-white font-bold">{label}</p>
          <p className="text-white/70">{`Time: ${payload[0].value.toFixed(2)} ms`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold">Algorithm Performance</h3>
        </div>
      </div>
      
      <div className="flex gap-3 mb-6">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Password to benchmark..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={runBenchmark}
          disabled={loading || !password}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Zap className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4" />}
          Run
        </button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
            <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{fill: 'rgba(255,255,255,0.5)'}} />
            <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" tick={{fill: 'rgba(255,255,255,0.8)'}} width={100} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="time" radius={[0, 4, 4, 0]} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-white/50 text-center">
        * Higher values are BETTER for password hashing (slower against attacks)
      </div>
    </motion.div>
  );
}
