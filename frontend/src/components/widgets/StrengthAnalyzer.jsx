import React, { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StrengthAnalyzer() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState({ score: 0, label: 'None', color: 'bg-white/10' });

  // Basic client-side analysis
  useEffect(() => {
    if (!password) {
      setStrength({ score: 0, label: 'None', color: 'bg-white/10' });
      return;
    }

    let score = 0;
    if (password.length > 8) score += 1;
    if (password.length > 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    // Pattern matching penalty
    const patterns = ['123', 'password', 'qwerty', 'admin', 'abc'];
    if (patterns.some(p => password.toLowerCase().includes(p))) {
      score = Math.max(0, score - 2);
    }

    if (score <= 2) setStrength({ score: 33, label: 'Weak 🔴', color: 'bg-red-500' });
    else if (score === 3 || score === 4) setStrength({ score: 66, label: 'Medium 🟡', color: 'bg-yellow-500' });
    else setStrength({ score: 100, label: 'Strong 🟢', color: 'bg-green-500' });
  }, [password]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-500/20 rounded-lg">
          <ShieldAlert className="w-5 h-5 text-yellow-500" />
        </div>
        <h3 className="text-xl font-bold">Password Strength Analyzer</h3>
      </div>

      <div className="space-y-6">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Test a password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm text-white/50 uppercase tracking-widest font-semibold">Security Score</span>
            <span className="text-lg font-bold">{strength.label}</span>
          </div>
          
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${strength.color}`}
              initial={{ width: 0 }}
              animate={{ width: `${strength.score}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
             <ShieldCheck className={password.length > 8 ? "text-green-400" : "text-white/20"} w={14}/>
             <span>8+ Characters</span>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className={/[A-Z]/.test(password) ? "text-green-400" : "text-white/20"} w={14}/>
             <span>Uppercase</span>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className={/[0-9]/.test(password) ? "text-green-400" : "text-white/20"} w={14}/>
             <span>Numbers</span>
          </div>
          <div className="flex items-center gap-2">
             <ShieldCheck className={/[^a-zA-Z0-9]/.test(password) ? "text-green-400" : "text-white/20"} w={14}/>
             <span>Symbols</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
