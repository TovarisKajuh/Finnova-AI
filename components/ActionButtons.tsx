import React from 'react';
import { Plus, ArrowLeftRight, List, MoreHorizontal } from 'lucide-react';

export const ActionButtons: React.FC = () => {
  const actions = [
    { icon: Plus, label: 'Add money' },
    { icon: ArrowLeftRight, label: 'Move' },
    { icon: List, label: 'Details' },
    { icon: MoreHorizontal, label: 'More' },
  ];

  return (
    <div className="flex justify-between px-8 py-6">
      {actions.map((action, index) => (
        <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-[#1e293b] flex items-center justify-center text-white shadow-lg border border-white/5 group-hover:bg-[#334155] group-hover:scale-105 transition-all duration-300">
            <action.icon className="w-6 h-6" />
          </div>
          <span className="text-xs text-gray-300 font-medium">{action.label}</span>
        </div>
      ))}
    </div>
  );
};
