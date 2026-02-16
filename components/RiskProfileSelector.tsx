import React from 'react';
import { RiskTolerance } from '../types';
import { RISK_PROFILES, PORTFOLIO_TEMPLATES } from '../constants';
import { Shield, TrendingUp, Flame, Zap, ChevronRight, Target, Clock, ArrowDownUp } from 'lucide-react';

interface RiskProfileSelectorProps {
  onSelect: (tolerance: RiskTolerance) => void;
}

const RISK_OPTIONS = [
  {
    tolerance: RiskTolerance.CONSERVATIVE,
    icon: Shield,
    title: 'Conservative',
    subtitle: 'Capital Preservation',
    color: 'emerald',
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    tolerance: RiskTolerance.MODERATE,
    icon: TrendingUp,
    title: 'Moderate',
    subtitle: 'Balanced Growth',
    color: 'blue',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    gradient: 'from-blue-600 to-indigo-600',
  },
  {
    tolerance: RiskTolerance.AGGRESSIVE,
    icon: Flame,
    title: 'Aggressive',
    subtitle: 'High Growth',
    color: 'orange',
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    gradient: 'from-orange-600 to-red-600',
  },
  {
    tolerance: RiskTolerance.DAY_TRADER,
    icon: Zap,
    title: 'Day Trader',
    subtitle: 'Active Trading',
    color: 'purple',
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    gradient: 'from-purple-600 to-pink-600',
  },
];

export const RiskProfileSelector: React.FC<RiskProfileSelectorProps> = ({ onSelect }) => {
  return (
    <div className="px-6 pt-4 pb-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Choose Your Strategy</h2>
      <p className="text-gray-400 text-sm mb-6">Select your risk tolerance to build a personalized AI-powered portfolio</p>

      <div className="space-y-4">
        {RISK_OPTIONS.map((option) => {
          const profile = RISK_PROFILES[option.tolerance];
          const template = PORTFOLIO_TEMPLATES.find(t => t.riskTolerance === option.tolerance);
          const Icon = option.icon;

          return (
            <button
              key={option.tolerance}
              onClick={() => onSelect(option.tolerance)}
              className={"glass-panel p-5 rounded-2xl w-full text-left transition-all hover:scale-[1.02] active:scale-[0.98] border " + option.borderColor + " hover:bg-white/5"}
            >
              <div className="flex items-start gap-4">
                <div className={"w-12 h-12 rounded-xl flex items-center justify-center shrink-0 " + option.bgColor}>
                  <Icon className={"w-6 h-6 " + option.textColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-bold text-white">{option.title}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className={"text-xs font-medium mb-2 " + option.textColor}>{option.subtitle}</p>
                  <p className="text-xs text-gray-400 mb-3">{template?.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                      <Target size={10} /> {template?.expectedReturn} Return
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                      <Clock size={10} /> {profile.timeHorizon} Horizon
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded-md">
                      <ArrowDownUp size={10} /> {profile.maxDrawdown}% Max DD
                    </span>
                    {profile.dayTradingEnabled && (
                      <span className="flex items-center gap-1 text-[10px] text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md">
                        <Zap size={10} /> Day Trading
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
