import React, { useState, useEffect } from 'react';
import { RiskTolerance, StockData, PortfolioTemplate } from '../types';
import { PORTFOLIO_TEMPLATES, MOCK_STOCKS, RISK_PROFILES } from '../constants';
import { buildPortfolioWithAI } from '../services/geminiService';
import { Loader2, PieChart, TrendingUp, Shield, Target, ArrowLeft, Sparkles, BarChart3, AlertTriangle } from 'lucide-react';

interface PortfolioBuilderProps {
  riskTolerance: RiskTolerance;
  onBack: () => void;
}

interface AIPortfolioResult {
  portfolio: Array<{ symbol: string; name: string; allocation: number; reason: string }>;
  strategy: string;
}

export const PortfolioBuilder: React.FC<PortfolioBuilderProps> = ({ riskTolerance, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AIPortfolioResult | null>(null);
  const [investmentAmount] = useState(10000);
  const template = PORTFOLIO_TEMPLATES.find(t => t.riskTolerance === riskTolerance)!;
  const profile = RISK_PROFILES[riskTolerance];

  useEffect(() => {
    const buildPortfolio = async () => {
      setLoading(true);
      try {
        const raw = await buildPortfolioWithAI(MOCK_STOCKS, riskTolerance, investmentAmount);
        const parsed = JSON.parse(raw);
        setResult(parsed);
      } catch (err) {
        // Fallback
        const suitable = MOCK_STOCKS.filter(s => s.suitableFor.includes(riskTolerance));
        const alloc = Math.round(100 / Math.max(suitable.length, 1));
        setResult({
          portfolio: suitable.map(s => ({
            symbol: s.symbol, name: s.name, allocation: alloc,
            reason: "Score: " + s.overallScore + "/100",
          })),
          strategy: "Diversified " + riskTolerance.toLowerCase() + " portfolio.",
        });
      }
      setLoading(false);
    };
    buildPortfolio();
  }, [riskTolerance, investmentAmount]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  const riskColors: Record<RiskTolerance, string> = {
    [RiskTolerance.CONSERVATIVE]: 'emerald',
    [RiskTolerance.MODERATE]: 'blue',
    [RiskTolerance.AGGRESSIVE]: 'orange',
    [RiskTolerance.DAY_TRADER]: 'purple',
  };
  const color = riskColors[riskTolerance];

  return (
    <div className="px-6 pt-4 pb-8 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
        <ArrowLeft size={18} /> Back to Risk Selection
      </button>

      <div className="flex items-center gap-3 mb-2">
        <Sparkles className={"w-6 h-6 text-" + color + "-400"} />
        <h2 className="text-2xl font-bold text-white">{template.name}</h2>
      </div>
      <p className="text-gray-400 text-sm mb-6">{template.description}</p>

      {/* Risk Profile Summary Card */}
      <div className={"bg-gradient-to-r " + (color === 'emerald' ? 'from-emerald-600 to-teal-600' : color === 'blue' ? 'from-blue-600 to-indigo-600' : color === 'orange' ? 'from-orange-600 to-red-600' : 'from-purple-600 to-pink-600') + " p-5 rounded-2xl shadow-2xl mb-6 relative overflow-hidden"}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-white/70 text-xs">Expected Return</p>
            <p className="text-white font-bold text-lg">{template.expectedReturn}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Volatility</p>
            <p className="text-white font-bold text-lg">{template.expectedVolatility}</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Max Drawdown</p>
            <p className="text-white font-bold">{profile.maxDrawdown}%</p>
          </div>
          <div>
            <p className="text-white/70 text-xs">Rebalance</p>
            <p className="text-white font-bold">{profile.rebalanceFrequency}</p>
          </div>
        </div>
        {profile.leverageAllowed && (
          <div className="mt-3 flex items-center gap-1 bg-white/20 rounded-full px-3 py-1 w-fit">
            <AlertTriangle size={12} className="text-white" />
            <span className="text-xs text-white">Up to {profile.maxLeverage}x leverage</span>
          </div>
        )}
      </div>

      {/* Asset Allocation */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <PieChart size={16} /> Target Allocation
        </h3>
        <div className="space-y-2">
          {template.allocations.map((alloc, i) => (
            <div key={alloc.category} className="glass-panel p-3 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white font-medium">{alloc.category}</span>
                <span className="text-sm text-white font-bold">{alloc.targetPercent}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: alloc.targetPercent + '%', backgroundColor: COLORS[i % COLORS.length] }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-500">Min: {alloc.minPercent}%</span>
                <span className="text-[10px] text-gray-500">Max: {alloc.maxPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Portfolio */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <BarChart3 size={16} /> AI Stock Picks
        </h3>

        {loading ? (
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center">
            <Loader2 className={"w-8 h-8 text-" + color + "-400 animate-spin mb-3"} />
            <p className="text-gray-400 text-sm">AI analyzing {MOCK_STOCKS.length} securities...</p>
            <p className="text-gray-500 text-xs mt-1">Running fundamental + technical analysis</p>
          </div>
        ) : result?.portfolio ? (
          <div className="space-y-3">
            {result.portfolio.map((item, i) => {
              const stockData = MOCK_STOCKS.find(s => s.symbol === item.symbol);
              return (
                <div key={item.symbol} className="glass-panel p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}>
                        {item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{item.symbol}</p>
                        <p className="text-gray-400 text-xs">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{item.allocation}%</p>
                      <p className="text-gray-400 text-xs">${((investmentAmount * item.allocation) / 100).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{item.reason}</p>
                  {stockData && (
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-300">Score: {stockData.overallScore}/100</span>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-300">Risk: {stockData.riskLevel}</span>
                      {stockData.technical.macdStatus !== 'Neutral' && (
                        <span className={"text-[10px] px-2 py-0.5 rounded " + (stockData.technical.macdStatus === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400')}>
                          MACD: {stockData.technical.macdStatus}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {result.strategy && (
              <div className="glass-panel p-4 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400 mb-1 font-medium">AI Strategy</p>
                <p className="text-sm text-gray-300">{result.strategy}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl text-center">
            <p className="text-gray-400">Unable to generate portfolio. Try again.</p>
          </div>
        )}
      </div>

      {/* Risk Warnings */}
      <div className="glass-panel p-4 rounded-xl border border-yellow-500/20 mb-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-yellow-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-yellow-400 text-xs font-medium mb-1">Risk Disclaimer</p>
            <p className="text-gray-400 text-[10px] leading-relaxed">
              This AI-generated portfolio is for informational purposes only. Past performance does not guarantee future results.
              Always consult a licensed financial advisor before making investment decisions. Trading involves risk of loss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
