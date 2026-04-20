import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Terminal, PlayCircle, Upload, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttackSimulator() {
  const [targetHash, setTargetHash] = useState('');
  const [algorithm, setAlgorithm] = useState('auto');
  const [logs, setLogs] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [customWordlist, setCustomWordlist] = useState([]);
  const [wordlistName, setWordlistName] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualWords, setManualWords] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setWordlistName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const words = text.split(/\r?\n/).map(w => w.trim()).filter(w => w.length > 0);
      setCustomWordlist(words);
    };
    reader.readAsText(file);
  };

  const handleManualSave = () => {
    const words = manualWords.split(/\r?\n/).map(w => w.trim()).filter(w => w.length > 0);
    if (words.length > 0) {
      setCustomWordlist(words);
      setWordlistName('Manual Entry');
      setIsManualEntryOpen(false);
    }
  };

  const startSimulation = async () => {
    if (!targetHash) return;
    setIsSimulating(true);
    setLogs([]);
    setResults(null);

    try {
      const payload = { 
        target_hash: targetHash,
        algorithm: algorithm,
        custom_wordlist: customWordlist.length > 0 ? customWordlist : undefined
      };

      const res = await axios.post('http://localhost:5000/simulate-attack', payload);
      
      const serverLogs = res.data.log;
      
      serverLogs.forEach((logItem, index) => {
        setTimeout(() => {
          setLogs(prev => [...prev, logItem]);
          
          if (index === serverLogs.length - 1) {
            setIsSimulating(false);
            setResults({
              cracked: res.data.cracked,
              crackedPassword: res.data.cracked_password,
              detectedAlgorithm: res.data.detected_algorithm,
              time: res.data.time_ms.toFixed(2)
            });
          }
        }, index * 200);
      });

    } catch (err) {
      console.error(err);
      setIsSimulating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
      className="glass-card p-6 border-red-500/20"
      style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(239,68,68,0.05) 100%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Terminal className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold">Live Attack Simulator</h3>
        </div>
        
        <select 
          className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 text-primary font-bold shadow-[0_0_10px_rgba(52,211,153,0.2)]"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="auto">✨ Auto-Solve (AI)</option>
          <option value="sha256">SHA-256</option>
          <option value="sha384">SHA-384</option>
          <option value="sha512">SHA-512</option>
          <option value="sha3_256">SHA-3 (256)</option>
          <option value="blake2">BLAKE2</option>
          <option value="blake3">BLAKE3</option>
          <option value="md5">MD5</option>
          <option value="bcrypt">bcrypt</option>
          <option value="argon2">Argon2</option>
          <option value="scrypt">scrypt</option>
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <input 
              type="text" 
              className="input-field border-red-500/20 focus:ring-red-500/50 flex-1" 
              placeholder="Paste target hash..."
              value={targetHash}
              onChange={(e) => setTargetHash(e.target.value)}
            />
            <button 
              onClick={startSimulation}
              disabled={isSimulating || !targetHash}
              className="flex items-center gap-2 whitespace-nowrap bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlayCircle className="w-5 h-5" />
              Hack
            </button>
          </div>

          <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
            <div className="text-xs text-white/50 px-2">
              {wordlistName ? (
                <span>Loaded Custom Wordlist: <strong className="text-white">'{wordlistName}'</strong> ({customWordlist.length} words)</span>
              ) : (
                <span>Using Default Top-100 Weak Passwords</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept=".txt" 
                onChange={handleFileUpload} 
              />
              <button 
                onClick={() => {
                  setIsManualEntryOpen(!isManualEntryOpen);
                  if(!isManualEntryOpen) setManualWords(customWordlist.join('\n'));
                }}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-md transition-colors border ${isManualEntryOpen ? 'bg-red-500/20 border-red-500/50' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}
              >
                <Edit3 className="w-3 h-3" />
                {isManualEntryOpen ? 'Close Editor' : 'Manual Entry'}
              </button>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-md transition-colors"
              >
                <Upload className="w-3 h-3" />
                Upload .txt
              </button>
            </div>
          </div>

          <AnimatePresence>
            {isManualEntryOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden space-y-2"
              >
                <textarea 
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-red-500 text-white/80 placeholder:text-white/20"
                  placeholder="Enter words here (one per line)..."
                  value={manualWords}
                  onChange={(e) => setManualWords(e.target.value)}
                />
                <button 
                  onClick={handleManualSave}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-500 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Save Wordlist
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Terminal Window */}
        <div className="bg-black/80 rounded-xl p-4 font-mono text-sm h-64 overflow-y-auto border border-white/10 shadow-inner">
          <div className="text-green-500 mb-2">HashLab OS [Version 1.0.0]</div>
          <div className="text-white/50 mb-4">(c) HashLab Corporation. All rights reserved.</div>
          
          <div className="space-y-1">
            <div className="text-yellow-400">&gt; Starting dictionary attack against hash...</div>
            <AnimatePresence>
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center bg-white/5 rounded px-2 py-1 my-1"
                >
                  <div className="flex flex-col">
                    <span className={log.status === 'INFO' ? 'text-blue-400 font-bold' : 'text-white/80'}>
                      {log.status === 'INFO' ? log.word : `Trying: ${log.word}`}
                    </span>
                    {log.hash && <span className="text-white/40 text-xs">Hash: {log.hash}</span>}
                  </div>
                  <span className={log.status === 'FAILED' ? 'text-red-500' : log.status === 'INFO' ? 'text-blue-500' : 'text-green-500 font-bold'}>
                    [{log.status}]
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {logs.length > 0 && isSimulating && (
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="pl-1">_</motion.div>
            )}

            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-lg border ${results.cracked ? 'bg-red-500/20 border-red-500/50 text-red-200' : 'bg-green-500/20 border-green-500/50 text-green-200'}`}
              >
                {results.cracked ? (
                  <div>
                    <strong className="block text-red-500 text-lg mb-1">CRITICAL VULNERABILITY!</strong>
                    Hash cracked! {results.detectedAlgorithm && <span className="text-blue-400 font-bold uppercase">[Detected {results.detectedAlgorithm}]</span>}<br/>
                    <span className="text-white bg-black/50 px-2 py-1 inline-block mt-2 rounded border border-red-500/30">
                      Plaintext Password: <strong className="text-green-400">{results.crackedPassword}</strong>
                    </span>
                  </div>
                ) : (
                  <div>
                    <strong className="block text-green-500 mb-1">SECURE!</strong>
                    Hash withstood the dictionary attack ({results.time}ms elapsed).
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
