import React, { useState } from 'react';
import { StockData } from '../types';
import { MOCK_STOCKS } from '../constants';
import { BarChart3, TrendingUp, TrendingDown, Activity, Eye, ChevronDown, ChevronUp, Zap, Target, Shield } from 'lucide-react';

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div className="mb-2">
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs text-white font-mono font-bold">{value}</span>
    </div>
    <div className="w-full bg-white/5 rounded-full h-1.5">
      <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: value + '%', backgroundColor: color }} />
    </div>
  </div>
);

const StockAnalysisCard: React.FC<{ stock: StockData }> = ({ stock }) => {
  const [expanded, setExpanded] = useState(false);
  const t = stock.technical;
  const f = stock.fundamental;
  const d = stock.dayTrading;
  const isPositive = stock.changePercent >= 0;

  return (
    <div className="glass-panel rounded-2xl mb-3 overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-sm">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <h4 className="text-white font-bold">{stock.symbol}</h4>
              <p className="text-xs text-gray-400">{stock.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-white font-bold">${stock.price.toLocaleString()}</p>
              <p className={"text-xs font-medium " + (isPositive ? "text-emerald-400" : "text-rose-400")}>
                {isPositive ? "+" : ""}{stock.changePercent}%
              </p>
            </div>
            <div className={"w-8 h-8 rounded-full flex items-center justify-center " + (stock.overallScore >= 70 ? "bg-emerald-500/20" : stock.overallScore >= 50 ? "bg-yellow-500/20" : "bg-rose-500/20")}>
              <span className={"text-xs font-bold " + (stock.overallScore >= 70 ? "text-emerald-400" : stock.overallScore >= 50 ? "text-yellow-400" : "text-rose-400")}>
                {stock.overallScore}
              </span>
            </div>
            {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 animate-fade-in">
          {/* AI Scores */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">AI Scores</p>
            <ScoreBar label="Technical" value={stock.technicalScore} color="#3b82f6" />
            <ScoreBar label="Fundamental" value={stock.fundamentalScore} color="#10b981" />
            <ScoreBar label="Momentum" value={stock.momentumScore} color="#f59e0b" />
            <ScoreBar label="Value" value={stock.valueScore} color="#8b5cf6" />
            <ScoreBar label="Quality" value={stock.qualityScore} color="#ec4899" />
            <ScoreBar label="Sentiment" value={stock.sentimentScore} color="#14b8a6" />
          </div>

          {/* Key Technical Indicators */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Technical Indicators</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">RSI (14)</p>
                <p className={"font-mono font-bold text-sm " + (t.rsi14 > 70 ? "text-rose-400" : t.rsi14 < 30 ? "text-emerald-400" : "text-white")}>{t.rsi14}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">MACD</p>
                <p className={"font-mono font-bold text-xs " + (t.macdStatus === 'Bullish' ? "text-emerald-400" : t.macdStatus === 'Bearish' ? "text-rose-400" : "text-gray-300")}>{t.macdStatus}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">ADX</p>
                <p className="font-mono font-bold text-sm text-white">{t.adx}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Supertrend</p>
                <p className={"font-mono font-bold text-xs " + (t.supertrendSignal === 'BUY' ? "text-emerald-400" : "text-rose-400")}>{t.supertrendSignal}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">BB %B</p>
                <p className="font-mono font-bold text-sm text-white">{t.bollingerPercentB.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">ATR (14)</p>
                <p className="font-mono font-bold text-sm text-white">{t.atr14}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">VWAP</p>
                <p className="font-mono font-bold text-sm text-white">${t.vwap.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">CMF</p>
                <p className={"font-mono font-bold text-sm " + (t.cmf > 0 ? "text-emerald-400" : "text-rose-400")}>{t.cmf.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Trend</p>
                <p className={"font-mono font-bold text-xs " + (t.trendDirection === 'UP' ? "text-emerald-400" : t.trendDirection === 'DOWN' ? "text-rose-400" : "text-gray-300")}>
                  {t.trendDirection}
                </p>
              </div>
            </div>
          </div>

          {/* Fundamental Metrics */}
          {f.peRatio > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Fundamental Metrics</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">P/E</p>
                  <p className="font-mono font-bold text-sm text-white">{f.peRatio.toFixed(1)}</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">PEG</p>
                  <p className={"font-mono font-bold text-sm " + (f.pegRatio < 1.5 ? "text-emerald-400" : "text-white")}>{f.pegRatio.toFixed(1)}</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">ROE</p>
                  <p className="font-mono font-bold text-sm text-white">{f.roe.toFixed(1)}%</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Rev Growth</p>
                  <p className={"font-mono font-bold text-xs " + (f.revenueGrowthYoY > 0 ? "text-emerald-400" : "text-rose-400")}>{f.revenueGrowthYoY > 0 ? "+" : ""}{f.revenueGrowthYoY}%</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">D/E</p>
                  <p className={"font-mono font-bold text-sm " + (f.debtToEquity < 1 ? "text-emerald-400" : "text-white")}>{f.debtToEquity.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 p-2 rounded-lg text-center">
                  <p className="text-[9px] text-gray-400 uppercase">Div Yield</p>
                  <p className="font-mono font-bold text-sm text-white">{f.dividendYield.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Day Trading Metrics */}
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Day Trading Metrics</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Scalp Score</p>
                <p className={"font-mono font-bold text-sm " + (d.scalpPotential > 70 ? "text-emerald-400" : d.scalpPotential > 40 ? "text-yellow-400" : "text-rose-400")}>{d.scalpPotential}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Speed-to-E</p>
                <p className="font-mono font-bold text-sm text-white">{d.speedToEarningsRatio.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Liquidity</p>
                <p className="font-mono font-bold text-sm text-white">{d.liquidityScore}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">R:R Ratio</p>
                <p className={"font-mono font-bold text-sm " + (d.riskRewardRatio > 1.5 ? "text-emerald-400" : "text-white")}>{d.riskRewardRatio.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Win Prob</p>
                <p className="font-mono font-bold text-sm text-white">{d.winProbability}%</p>
              </div>
              <div className="bg-white/5 p-2 rounded-lg text-center">
                <p className="text-[9px] text-gray-400 uppercase">Options</p>
                <p className={"font-mono font-bold text-xs " + (d.optionsFlow === 'BULLISH' ? "text-emerald-400" : d.optionsFlow === 'BEARISH' ? "text-rose-400" : "text-gray-300")}>{d.optionsFlow}</p>
              </div>
            </div>
          </div>

          {/* Support/Resistance Levels */}
          <div className="mt-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Key Levels</p>
            <div className="flex justify-between text-[10px]">
              <div className="text-center">
                <p className="text-rose-400">S3</p>
                <p className="text-white font-mono">${t.support3}</p>
              </div>
              <div className="text-center">
                <p className="text-rose-400">S2</p>
                <p className="text-white font-mono">${t.support2}</p>
              </div>
              <div className="text-center">
                <p className="text-rose-400">S1</p>
                <p className="text-white font-mono">${t.support1}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400">Pivot</p>
                <p className="text-white font-mono font-bold">${t.pivotPoint}</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400">R1</p>
                <p className="text-white font-mono">${t.resistance1}</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400">R2</p>
                <p className="text-white font-mono">${t.resistance2}</p>
              </div>
              <div className="text-center">
                <p className="text-emerald-400">R3</p>
                <p className="text-white font-mono">${t.resistance3}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AnalysisDashboard: React.FC = () => {
  return (
    <div className="px-6 pt-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Deep Analysis</h2>
      <p className="text-gray-400 text-sm mb-4">AI-powered technical + fundamental analysis with 100+ KPIs</p>

      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar pb-2">
        {['All', 'Technology', 'Healthcare', 'Crypto'].map((filter) => (
          <button key={filter} className={"px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors " + (filter === 'All' ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10")}>
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {MOCK_STOCKS.map(stock => (
          <StockAnalysisCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};
