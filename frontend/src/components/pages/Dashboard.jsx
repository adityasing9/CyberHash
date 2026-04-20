import React, { useState } from 'react';
import { Shield, Key, Activity } from 'lucide-react';
import HashGenerator from '../widgets/HashGenerator';
import AttackSimulator from '../widgets/AttackSimulator';
import Argon2Playground from '../widgets/Argon2Playground';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Top Navbar */}
      <nav className="glass-card !border-x-0 !border-t-0 !rounded-none z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.3)] border border-primary/20">
              <Shield className="text-black w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">CYBER HASH</h1>
              <p className="text-[10px] text-primary/40 font-bold tracking-[0.2em] uppercase hidden sm:block">Tactical Intelligence</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'generator'
                  ? 'bg-primary/20 text-white border border-primary/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4 hidden sm:block" />
              <span className="font-medium text-sm">Generator & Tuning</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'simulator'
                  ? 'bg-primary/20 text-white border border-primary/30' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4 hidden sm:block" />
              <span className="font-medium text-sm">Attack Simulator</span>
            </button>
          </div>

          {/* System Status */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs text-white/70">API Connected</span>
          </div>

        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                {activeTab === 'generator' ? 'Generator & Tuning' : 'Live Attack Simulator'}
              </h2>
              <p className="text-white/60">
                {activeTab === 'generator' 
                  ? 'Visualize password security and fine-tune cryptographic algorithms.'
                  : 'Simulate dictionary attacks to test password vulnerabilities.'}
              </p>
            </header>

            {/* Tab Rendering Logic */}
            {activeTab === 'generator' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <HashGenerator />
                </div>
                <div className="space-y-8">
                  <Argon2Playground />
                </div>
              </div>
            )}

            {activeTab === 'simulator' && (
              <div className="w-full max-w-4xl mx-auto">
                <AttackSimulator />
              </div>
            )}
            
        </div>
      </main>
    </div>
  );
}
