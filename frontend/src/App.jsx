import React from 'react';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[130px] pointer-events-none" />
      
      <Dashboard />
    </div>
  );
}

export default App;
