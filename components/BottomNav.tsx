import React from 'react';
import { Home, CreditCard, ArrowLeftRight, Store, LineChart } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: ViewState.HOME, icon: Home, label: 'Home' },
    { id: ViewState.TRADING, icon: ArrowLeftRight, label: 'Trade' },
    { id: ViewState.ANALYSIS, icon: LineChart, label: 'Analysis' },
    { id: ViewState.PORTFOLIO, icon: CreditCard, label: 'Portfolio' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-1.5 shadow-2xl z-50 flex justify-between items-center">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center justify-center w-full py-3 rounded-2xl transition-all duration-300 ${
              isActive 
                ? 'bg-[#1e293b] text-white shadow-inner' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
