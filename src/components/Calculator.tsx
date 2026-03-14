import React, { useState, useEffect } from 'react';
import * as math from 'mathjs';
import { motion } from 'motion/react';
import { Delete, RotateCcw, Equal, Hash, FunctionSquare as Functions, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface CalculatorProps {
  onExpressionChange: (expr: string) => void;
}

export function Calculator({ onExpressionChange }: CalculatorProps) {
  const [display, setDisplay] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    onExpressionChange(display);
  }, [display, onExpressionChange]);

  const handleInput = (val: string) => {
    if (result !== null) {
      if (['+', '-', '*', '/', '^'].includes(val)) {
        setDisplay(result + val);
      } else {
        setDisplay(val);
      }
      setResult(null);
    } else {
      setDisplay(prev => prev + val);
    }
  };

  const clear = () => {
    setDisplay('');
    setResult(null);
  };

  const backspace = () => {
    if (result !== null) {
      setResult(null);
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      if (!display) return;
      const res = math.evaluate(display);
      const formattedRes = math.format(res, { precision: 10 });
      setResult(formattedRes.toString());
      setHistory(prev => [display + ' = ' + formattedRes, ...prev].slice(0, 10));
    } catch (error) {
      setResult('Error');
    }
  };

  const buttons = [
    { label: 'C', action: clear, type: 'danger' },
    { label: '(', action: () => handleInput('('), type: 'op' },
    { label: ')', action: () => handleInput(')'), type: 'op' },
    { label: '/', action: () => handleInput('/'), type: 'op' },
    
    { label: 'sin', action: () => handleInput('sin('), type: 'func' },
    { label: '7', action: () => handleInput('7'), type: 'num' },
    { label: '8', action: () => handleInput('8'), type: 'num' },
    { label: '9', action: () => handleInput('9'), type: 'num' },
    { label: '*', action: () => handleInput('*'), type: 'op' },

    { label: 'cos', action: () => handleInput('cos('), type: 'func' },
    { label: '4', action: () => handleInput('4'), type: 'num' },
    { label: '5', action: () => handleInput('5'), type: 'num' },
    { label: '6', action: () => handleInput('6'), type: 'num' },
    { label: '-', action: () => handleInput('-'), type: 'op' },

    { label: 'tan', action: () => handleInput('tan('), type: 'func' },
    { label: '1', action: () => handleInput('1'), type: 'num' },
    { label: '2', action: () => handleInput('2'), type: 'num' },
    { label: '3', action: () => handleInput('3'), type: 'num' },
    { label: '+', action: () => handleInput('+'), type: 'op' },

    { label: 'log', action: () => handleInput('log10('), type: 'func' },
    { label: '0', action: () => handleInput('0'), type: 'num' },
    { label: '.', action: () => handleInput('.'), type: 'num' },
    { label: '^', action: () => handleInput('^'), type: 'op' },
    { label: '=', action: calculate, type: 'equal' },
  ];

  const scientific = [
    { label: 'π', action: () => handleInput('PI'), type: 'func' },
    { label: 'e', action: () => handleInput('e'), type: 'func' },
    { label: '√', action: () => handleInput('sqrt('), type: 'func' },
    { label: 'ln', action: () => handleInput('log('), type: 'func' },
    { label: '!', action: () => handleInput('!'), type: 'func' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#151619] p-6 font-mono">
      {/* Display Area */}
      <div className="relative mb-8 bg-[#0a0b0d] rounded-2xl p-6 border border-[#2a2b2e] shadow-inner min-h-[160px] flex flex-col justify-end items-end overflow-hidden">
        <div className="absolute top-4 left-4 flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        
        <div className="text-zinc-500 text-sm mb-2 break-all text-right w-full">
          {display || '0'}
        </div>
        <div className="text-4xl font-bold text-white tracking-tight break-all text-right w-full">
          {result !== null ? result : (display ? '' : '0')}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-4">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest transition-all",
            showHistory ? "bg-emerald-500 text-white" : "bg-[#1a1b1e] text-zinc-400 border border-[#2a2b2e]"
          )}
        >
          <History size={14} /> History
        </button>
        <button 
          onClick={backspace}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs uppercase tracking-widest bg-[#1a1b1e] text-zinc-400 border border-[#2a2b2e] hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <Delete size={14} /> Back
        </button>
      </div>

      <div className="relative flex-1 grid grid-cols-1 gap-4">
        {showHistory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1b1e] border border-[#2a2b2e] rounded-xl p-4 overflow-y-auto max-h-[400px]"
          >
            <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Calculation History</h3>
            {history.length === 0 ? (
              <p className="text-zinc-600 italic text-sm">No history yet</p>
            ) : (
              <div className="space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="text-sm border-b border-[#2a2b2e] pb-2 last:border-0">
                    <p className="text-zinc-500 text-xs">{item.split('=')[0]}</p>
                    <p className="text-emerald-400 font-bold">= {item.split('=')[1]}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-5 gap-3">
            {/* Scientific Row */}
            <div className="col-span-5 grid grid-cols-5 gap-3 mb-2">
              {scientific.map((btn, idx) => (
                <CalcButton key={idx} label={btn.label} action={btn.action} type={btn.type} />
              ))}
            </div>

            {/* Main Grid */}
            {buttons.map((btn, idx) => (
              <CalcButton key={idx} label={btn.label} action={btn.action} type={btn.type} className={btn.type === 'equal' ? 'col-span-1' : ''} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CalcButtonProps {
  label: string;
  action: () => void;
  type: string;
  className?: string;
  key?: React.Key;
}

function CalcButton({ label, action, type, className }: CalcButtonProps) {
  const baseStyles = "h-14 rounded-xl flex items-center justify-center text-lg font-bold transition-all active:scale-95 border";
  
  const typeStyles = {
    num: "bg-[#1a1b1e] text-white border-[#2a2b2e] hover:bg-[#25262b]",
    op: "bg-[#1a1b1e] text-emerald-400 border-[#2a2b2e] hover:bg-emerald-500/10",
    func: "bg-[#1a1b1e] text-zinc-400 border-[#2a2b2e] hover:bg-zinc-800 text-sm",
    danger: "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white",
    equal: "bg-emerald-500 text-white border-emerald-400 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  }[type as keyof typeof typeStyles];

  return (
    <button 
      onClick={action}
      className={cn(baseStyles, typeStyles, className)}
    >
      {label}
    </button>
  );
}
