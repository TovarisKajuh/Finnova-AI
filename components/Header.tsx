import React from 'react';
import { Search, Bell, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between px-6 pt-14 pb-4">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white/20">
            <img src="https://picsum.photos/100/100" alt="User" className="w-full h-full object-cover" />
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search stocks, crypto..." 
            className="w-full bg-[#1e293b] border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-500"
          />
        </div>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e40af] text-white hover:bg-blue-600 transition-colors ml-4 shadow-lg shadow-blue-900/50">
        <Bell className="w-5 h-5" />
      </button>
    </div>
  );
};
