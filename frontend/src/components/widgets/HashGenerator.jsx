import React, { useState } from 'react';
import axios from 'axios';
import { Copy, RefreshCw, KeyRound, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HashGenerator() {
  const [password, setPassword] = useState('');
  const [hashes, setHashes] = useState({ sha256: '', sha384: '', sha512: '', sha3_256: '', blake2: '', blake3: '', bcrypt: '', argon2: '', scrypt: '' });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const generateHashes = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/hash', { password });
      setHashes(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const HashOutput = ({ label, value, type, icon: Icon, badge }) => (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5 relative group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/50" />
          <span className="text-sm font-medium text-white/80">{label}</span>
          {badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">{badge}</span>}
        </div>
        <button 
          onClick={() => copyToClipboard(value, type)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
          disabled={!value}
        >
          {copied === type ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="font-mono text-xs text-white/60 break-all bg-black/20 p-2 rounded-lg min-h-[36px] flex items-center">
        {value ? value : <span className="text-white/20">Awaiting input...</span>}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg">
          <RefreshCw className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Multi-Hash Generator</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">Input Password</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. s3cur3_p@ssw0rd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generateHashes()}
            />
            <button 
              onClick={generateHashes}
              disabled={loading || !password}
              className="primary-button whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : 'Generate'}
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-border max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <HashOutput label="Argon2" value={hashes.argon2} type="argon2" icon={KeyRound} badge="Recommended" />
          <HashOutput label="bcrypt" value={hashes.bcrypt} type="bcrypt" icon={KeyRound} />
          <HashOutput label="scrypt" value={hashes.scrypt} type="scrypt" icon={KeyRound} badge="Memory Hard" />
          <HashOutput label="BLAKE3" value={hashes.blake3} type="blake3" icon={KeyRound} badge="Ultra Fast" />
          <HashOutput label="BLAKE2" value={hashes.blake2} type="blake2" icon={KeyRound} />
          <HashOutput label="SHA-3 (256)" value={hashes.sha3_256} type="sha3_256" icon={KeyRound} />
          <HashOutput label="SHA-512" value={hashes.sha512} type="sha512" icon={KeyRound} />
          <HashOutput label="SHA-384" value={hashes.sha384} type="sha384" icon={KeyRound} />
          <HashOutput label="SHA-256" value={hashes.sha256} type="sha256" icon={KeyRound} badge="Weak for Passwords" />
        </div>
      </div>
    </motion.div>
  );
}
