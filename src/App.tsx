/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calculator } from './components/Calculator';
import { AIChat } from './components/AIChat';
import { motion } from 'motion/react';
import { Cpu, Maximize2, Minimize2 } from 'lucide-react';

export default function App() {
  const [currentExpression, setCurrentExpression] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl h-[850px] bg-[#151619] rounded-[32px] border border-[#2a2b2e] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Main Calculator Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-16 border-b border-[#2a2b2e] flex items-center justify-between px-6 bg-[#1a1b1e]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Cpu size={18} className="text-emerald-400" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase">NovaCalc AI</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Scientific Computing System v2.5</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              {isSidebarOpen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>

          <div className="flex-1 relative">
            <Calculator onExpressionChange={setCurrentExpression} />
          </div>
        </div>

        {/* AI Sidebar */}
        <motion.div 
          animate={{ width: isSidebarOpen ? '400px' : '0px' }}
          className="overflow-hidden border-l border-[#2a2b2e] hidden md:block"
        >
          <div className="w-[400px] h-full">
            <AIChat currentExpression={currentExpression} />
          </div>
        </motion.div>

        {/* Mobile AI Toggle (Floating) */}
        <div className="md:hidden fixed bottom-6 right-6">
           {/* Mobile implementation could be a modal, but for now we focus on desktop layout as per recipes */}
        </div>
      </motion.div>
    </div>
  );
}

