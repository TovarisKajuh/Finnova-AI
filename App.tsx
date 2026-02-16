import React, { useState, useEffect } from 'react';
import { ViewState, StockData, TradeSignal, RiskTolerance } from './types';
import { MOCK_STOCKS, INITIAL_SIGNALS, MOCK_PORTFOLIO } from './constants';
import { analyzeMarket } from './services/geminiService';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ActionButtons } from './components/ActionButtons';
import { ChartComponent } from './components/ChartComponent';
import { RiskProfileSelector } from './components/RiskProfileSelector';
import { PortfolioBuilder } from './components/PortfolioBuilder';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { TrendingUp, TrendingDown, Activity, Zap, Target, ArrowUpDown } from 'lucide-react';

// --- Signal Card ---
const SignalCard: React.FC<{ signal: TradeSignal }> = ({ signal }) => {
  const isBuy = signal.type === 'BUY';
  const isSell = signal.type === 'SELL';
  return (
    <div className="glass-panel p-4 rounded-2xl mb-3 hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={"w-10 h-10 rounded-full flex items-center justify-center shrink-0 " + (isBuy ? 'bg-emerald-500/20 text-emerald-400' : isSell ? 'bg-rose-500/20 text-rose-400' : 'bg-yellow-500/20 text-yellow-400')}>
          {isBuy ? <TrendingUp size={20} /> : isSell ? <TrendingDown size={20} /> : <ArrowUpDown size={20} />}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white">
                {signal.symbol}{' '}
                <span className={"text-xs ml-2 px-2 py-0.5 rounded-full " + (isBuy ? 'bg-emerald-500/20 text-emerald-400' : isSell ? 'bg-rose-500/20 text-rose-400' : 'bg-yellow-500/20 text-yellow-400')}>
                  {signal.type}
                </span>
              </h4>
              <p className="text-xs text-gray-400 mt-1">{signal.timeframe} | Conf: {signal.confidence}%{signal.analysisType ? ' | ' + signal.analysisType : ''}</p>
            </div>
            <span className="text-xs text-gray-500">{signal.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="text-sm text-gray-300 mt-2 leading-relaxed opacity-90">{signal.reason}</p>

          {signal.entryPrice && (
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-300">Entry: ${signal.entryPrice.toLocaleString()}</span>
              {signal.targetPrice && <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-400">TP: ${signal.targetPrice.toLocaleString()}</span>}
              {signal.stopLoss && <span className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded text-rose-400">SL: ${signal.stopLoss.toLocaleString()}</span>}
              {signal.riskRewardRatio && <span className="text-[10px] bg-blue-500/10 px-2 py-0.5 rounded text-blue-400">R:R {signal.riskRewardRatio.toFixed(2)}</span>}
            </div>
          )}

          {signal.indicators && signal.indicators.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {signal.indicators.map((ind, i) => (
                <span key={i} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-400">{ind}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Portfolio Card ---
const PortfolioCard: React.FC<{ item: typeof MOCK_PORTFOLIO[0] }> = ({ item }) => (
  <div className="glass-panel p-5 rounded-2xl mb-3 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: item.color }}>
        {item.symbol[0]}
      </div>
      <div>
        <h4 className="font-bold text-white">{item.symbol}</h4>
        <p className="text-xs text-gray-400">{item.amount} {item.sector === 'Crypto' ? 'Units' : 'Shares'} | {item.sector}</p>
      </div>
    </div>
    <div className="text-right">
      <h4 className="font-bold text-white">${item.value.toLocaleString()}</h4>
      <p className={"text-xs font-medium " + (item.returnPercent >= 0 ? "text-emerald-400" : "text-rose-400")}>
        {item.returnPercent >= 0 ? "+" : ""}{item.returnPercent}%
      </p>
    </div>
  </div>
);

// === MAIN APP ===
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [signals, setSignals] = useState<TradeSignal[]>(INITIAL_SIGNALS);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskTolerance | null>(null);
  const [scanMode, setScanMode] = useState<'SCALP' | 'SWING' | 'LONG_TERM'>('SCALP');

  // Auto-scan every 30s when on trading view
  useEffect(() => {
    const interval = setInterval(() => {
      if (view === ViewState.TRADING && !analyzing) {
        handleScanMarket();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [view, analyzing]);

  const handleScanMarket = async () => {
    const stock = MOCK_STOCKS[Math.floor(Math.random() * MOCK_STOCKS.length)];
    setAnalyzing(stock.symbol);

    const result = await analyzeMarket(stock, scanMode);

    if (result.type) {
      const newSignal: TradeSignal = {
        id: Date.now().toString(),
        symbol: stock.symbol,
        type: result.type as 'BUY' | 'SELL' | 'HOLD',
        confidence: result.confidence || 0,
        reason: result.reason || "Analysis complete.",
        timestamp: new Date(),
        timeframe: scanMode,
        entryPrice: result.entryPrice,
        targetPrice: result.targetPrice,
        stopLoss: result.stopLoss,
        riskRewardRatio: result.riskRewardRatio,
        indicators: result.indicators,
        analysisType: result.analysisType,
      };
      setSignals(prev => [newSignal, ...prev.slice(0, 19)]);
    }
    setAnalyzing(null);
  };

  const handleRiskSelect = (tolerance: RiskTolerance) => {
    setSelectedRisk(tolerance);
    setView(ViewState.PORTFOLIO_BUILDER);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md mx-auto w-full min-h-screen flex flex-col relative z-10">
        <Header />

        {/* HOME */}
        {view === ViewState.HOME && (
          <div className="flex-1 animate-fade-in">
            <div className="flex flex-col items-center mt-4 mb-8 text-center">
              <div className="flex items-center gap-2 mb-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                <img src="https://flagcdn.com/sg.svg" alt="Region" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-xs font-medium text-gray-300">Main | USD</span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight flex items-start justify-center gap-1">
                <span className="text-2xl mt-1 opacity-60">$</span>
                12,459
                <span className="text-2xl mt-1 opacity-60">.82</span>
              </h1>
              <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                <TrendingUp size={14} /> +$1,204 (10.4%) Today
              </p>
              <button
                onClick={() => setView(ViewState.RISK_PROFILE)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium rounded-full transition-all border border-white/10 shadow-lg shadow-blue-900/30"
              >
                Build AI Portfolio
              </button>
            </div>

            <ActionButtons />

            <div className="px-6 pb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">AI Trade Signals</h3>
                <button
                  onClick={handleScanMarket}
                  disabled={!!analyzing}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full transition-colors"
                >
                  {analyzing ? (
                    <>Analyzing {analyzing}...</>
                  ) : (
                    <><Zap size={14} fill="currentColor" /> Scan Market</>
                  )}
                </button>
              </div>
              <div className="space-y-1">
                {signals.map(signal => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRADING */}
        {view === ViewState.TRADING && (
          <div className="px-6 pt-4 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Scalp Terminal</h2>
              <div className="flex gap-1">
                {(['SCALP', 'SWING', 'LONG_TERM'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setScanMode(mode)}
                    className={"px-3 py-1 rounded-full text-[10px] font-medium transition-colors " + (scanMode === mode ? "bg-white text-black" : "bg-white/5 text-gray-400 hover:bg-white/10")}
                  >
                    {mode === 'LONG_TERM' ? 'LONG' : mode}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const stock = MOCK_STOCKS[0];
              const t = stock.technical;
              const d = stock.dayTrading;
              return (
                <div className="glass-panel p-5 rounded-2xl mb-6 border-l-4 border-l-emerald-500 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
                      <p className="text-xs text-gray-400">{stock.name} | {stock.sector}</p>
                    </div>
                    <div className="text-right">
                      <h3 className={"text-lg font-bold " + (stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400")}>${stock.price.toLocaleString()}</h3>
                      <p className={"text-xs " + (stock.changePercent >= 0 ? "text-emerald-500" : "text-rose-500")}>{stock.changePercent >= 0 ? "+" : ""}{stock.changePercent}%</p>
                    </div>
                  </div>
                  <ChartComponent symbol={stock.symbol} color="#10b981" />
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">RSI</p>
                      <p className={"font-mono font-bold text-sm " + (t.rsi14 > 70 ? "text-rose-400" : t.rsi14 < 30 ? "text-emerald-400" : "text-white")}>{t.rsi14}</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">MACD</p>
                      <p className={"font-mono font-bold text-xs " + (t.macdStatus === 'Bullish' ? "text-emerald-400" : t.macdStatus === 'Bearish' ? "text-rose-400" : "text-white")}>{t.macdStatus}</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">Scalp</p>
                      <p className={"font-mono font-bold text-sm " + (d.scalpPotential > 70 ? "text-emerald-400" : "text-white")}>{d.scalpPotential}</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">R:R</p>
                      <p className={"font-mono font-bold text-sm " + (d.riskRewardRatio > 1.5 ? "text-emerald-400" : "text-white")}>{d.riskRewardRatio}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">Speed-E</p>
                      <p className="text-white font-mono font-bold text-sm">{d.speedToEarningsRatio}</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">Liquidity</p>
                      <p className="text-white font-mono font-bold text-sm">{d.liquidityScore}/100</p>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <p className="text-[9px] text-gray-400 uppercase">VWAP Dev</p>
                      <p className={"font-mono font-bold text-sm " + (d.vwapDeviation > 0 ? "text-emerald-400" : "text-rose-400")}>{d.vwapDeviation > 0 ? "+" : ""}{d.vwapDeviation}%</p>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={handleScanMarket} disabled={!!analyzing} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-900/50 transition-all active:scale-95 disabled:opacity-50">
                      {analyzing ? 'Scanning...' : 'Buy Market'}
                    </button>
                    <button className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-rose-900/50 transition-all active:scale-95">
                      Sell Market
                    </button>
                  </div>
                </div>
              );
            })()}

            <h3 className="text-white font-semibold mb-3">Active Positions</h3>
            <div className="glass-panel p-4 rounded-xl flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Activity size={16} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">BTC/USD Scalp</p>
                  <p className="text-xs text-gray-400">5x Leverage | Long</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold text-sm">+$420.50</p>
                <p className="text-xs text-emerald-500">12.5%</p>
              </div>
            </div>

            <h3 className="text-white font-semibold mb-3 mt-4">Recent Signals</h3>
            <div className="space-y-1">
              {signals.slice(0, 3).map(signal => (
                <SignalCard key={signal.id} signal={signal} />
              ))}
            </div>
          </div>
        )}

        {/* PORTFOLIO */}
        {view === ViewState.PORTFOLIO && (
          <div className="px-6 pt-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Long Term</h2>
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Assets</p>
              <h3 className="text-4xl font-bold text-white">$22,686.00</h3>
              <div className="mt-6 flex gap-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">+24.5% All time</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">Risk: Mod.</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-white">Allocations</h3>
              <button onClick={() => setView(ViewState.RISK_PROFILE)} className="text-blue-400 text-xs flex items-center gap-1">
                <Target size={12} /> Rebalance with AI
              </button>
            </div>
            <div>
              {MOCK_PORTFOLIO.map(item => (
                <PortfolioCard key={item.symbol} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* ANALYSIS */}
        {view === ViewState.ANALYSIS && <AnalysisDashboard />}

        {/* RISK PROFILE SELECTION */}
        {view === ViewState.RISK_PROFILE && (
          <RiskProfileSelector onSelect={handleRiskSelect} />
        )}

        {/* PORTFOLIO BUILDER */}
        {view === ViewState.PORTFOLIO_BUILDER && selectedRisk && (
          <PortfolioBuilder riskTolerance={selectedRisk} onBack={() => setView(ViewState.RISK_PROFILE)} />
        )}

        <BottomNav currentView={view} setView={setView} />
      </div>
    </div>
  );
};

export default App;
