import { GoogleGenAI } from "@google/genai";
import { StockData, TradeSignal, RiskTolerance } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeMarket = async (
  stock: StockData,
  mode: 'SCALP' | 'SWING' | 'LONG_TERM',
  riskTolerance?: RiskTolerance
): Promise<Partial<TradeSignal>> => {
  if (!process.env.API_KEY) {
    return generateOfflineAnalysis(stock, mode);
  }

  const prompt = buildAnalysisPrompt(stock, mode, riskTolerance);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      type: result.type,
      confidence: result.confidence,
      reason: result.reason,
      timeframe: mode,
      entryPrice: result.entryPrice,
      targetPrice: result.targetPrice,
      stopLoss: result.stopLoss,
      riskRewardRatio: result.riskRewardRatio,
      indicators: result.indicators,
      analysisType: result.analysisType || 'COMBINED',
    };
  } catch (error) {
    console.error("Gemini analysis failed", error);
    return generateOfflineAnalysis(stock, mode);
  }
};

export const buildPortfolioWithAI = async (
  stocks: StockData[],
  riskTolerance: RiskTolerance,
  investmentAmount: number
): Promise<string> => {
  if (!process.env.API_KEY) {
    const suitable = stocks.filter(s => s.suitableFor.includes(riskTolerance)).slice(0, 5);
    const allocPer = Math.round(100 / Math.max(suitable.length, 1));
    return JSON.stringify({
      portfolio: suitable.map(s => ({
        symbol: s.symbol, name: s.name, allocation: allocPer,
        reason: "Score: " + s.overallScore + "/100, Risk: " + s.riskLevel,
      })),
      strategy: "AI-optimized " + riskTolerance.toLowerCase() + " portfolio based on " + stocks.length + " analyzed securities.",
    });
  }

  const stockSummaries = stocks.map(s => ({
    symbol: s.symbol, name: s.name, price: s.price, sector: s.sector,
    overallScore: s.overallScore, technicalScore: s.technicalScore,
    fundamentalScore: s.fundamentalScore, riskLevel: s.riskLevel,
    peRatio: s.fundamental.peRatio, pegRatio: s.fundamental.pegRatio,
    roe: s.fundamental.roe, revenueGrowthYoY: s.fundamental.revenueGrowthYoY,
    dividendYield: s.fundamental.dividendYield, debtToEquity: s.fundamental.debtToEquity,
    rsi: s.technical.rsi14, macd: s.technical.macdStatus,
    trendDirection: s.technical.trendDirection, trendStrength: s.technical.trendStrength,
  }));

  const prompt = [
    "You are an expert portfolio manager. Build an investment portfolio for a " + riskTolerance + " risk tolerance investor with $" + investmentAmount.toLocaleString() + " to invest.",
    "",
    "Available Securities:",
    JSON.stringify(stockSummaries, null, 2),
    "",
    "Requirements based on risk tolerance (" + riskTolerance + "):",
    "- CONSERVATIVE: Focus on low-volatility, dividend-paying stocks. Max 30% in any single position.",
    "- MODERATE: Balanced growth and value. Max 25% in any single position.",
    "- AGGRESSIVE: Growth-focused with higher concentration allowed. Max 40% in any single position.",
    "- DAY_TRADER: Focus on high-liquidity, high-volatility stocks. Keep 40-60% in cash.",
    "",
    "Return ONLY a JSON object with:",
    '- portfolio: array of { symbol, name, allocation (%), reason (1 sentence) }',
    "- strategy: brief overall strategy description (2-3 sentences)",
    "- expectedReturn: estimated annual return range",
    "- riskMetrics: { maxDrawdown, sharpeRatio, diversificationScore }",
  ].join("\n");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    return response.text || '{}';
  } catch (error) {
    console.error("Portfolio AI failed", error);
    return '{}';
  }
};

function buildAnalysisPrompt(stock: StockData, mode: string, riskTolerance?: RiskTolerance): string {
  const t = stock.technical;
  const f = stock.fundamental;
  const d = stock.dayTrading;
  const modeDesc = mode === 'SCALP' ? 'scalp trading (minutes to hours)' : mode === 'SWING' ? 'swing trading (days to weeks)' : 'long-term investment (months to years)';

  const lines = [
    "You are an expert financial trading AI performing " + modeDesc + " analysis.",
    riskTolerance ? "Risk tolerance: " + riskTolerance : "",
    "",
    "=== STOCK: " + stock.symbol + " (" + stock.name + ") ===",
    "Price: $" + stock.price + " | Change: " + stock.changePercent + "% | Volume: " + stock.volume.toLocaleString(),
    "52W Range: $" + stock.week52Low + " - $" + stock.week52High + " | Market Cap: $" + (stock.marketCap / 1e9).toFixed(1) + "B",
    "",
    "=== TECHNICAL INDICATORS (100+ KPIs) ===",
    "MOMENTUM: RSI(14)=" + t.rsi14 + ", RSI(7)=" + t.rsi7 + ", StochK=" + t.stochasticK + ", StochD=" + t.stochasticD + ", Williams%R=" + t.williamsR + ", MFI=" + t.mfi + ", ROC=" + t.roc + ", CCI=" + t.cci + ", UltOsc=" + t.ultimateOscillator,
    "TREND: MACD(" + t.macdLine + "/" + t.macdSignal + "/" + t.macdHistogram + ")=" + t.macdStatus + ", ADX=" + t.adx + ", +DI=" + t.plusDI + ", -DI=" + t.minusDI + ", Aroon(" + t.aroonUp + "/" + t.aroonDown + ")=" + t.aroonOscillator,
    "MOVING AVG: EMA(9/20/50/200)=" + t.ema9 + "/" + t.ema20 + "/" + t.ema50 + "/" + t.ema200 + ", SMA(20/50/200)=" + t.sma20 + "/" + t.sma50 + "/" + t.sma200,
    "ICHIMOKU: Tenkan=" + t.ichimokuTenkan + ", Kijun=" + t.ichimokuKijun + ", SenkouA=" + t.ichimokuSenkouA + ", SenkouB=" + t.ichimokuSenkouB,
    "SUPERTREND: " + t.supertrend + " Signal=" + t.supertrendSignal + ", PSAR=" + t.psar,
    "VOLATILITY: BB(" + t.bollingerLower + "/" + t.bollingerMiddle + "/" + t.bollingerUpper + ") %B=" + t.bollingerPercentB + ", ATR(14)=" + t.atr14 + ", StdDev=" + t.stdDev20,
    "KELTNER: " + t.keltnerLower + "/" + t.keltnerMiddle + "/" + t.keltnerUpper + ", Donchian: " + t.donchianLow + "-" + t.donchianHigh,
    "HV=" + t.historicalVolatility + "%, IV=" + t.impliedVolatility + "%, Chaikin Vol=" + t.chaikinVolatility,
    "VOLUME: OBV=" + t.obv + " slope=" + t.obvSlope + ", VWAP=" + t.vwap + ", VolRatio=" + t.volumeRatio + ", CMF=" + t.cmf + ", A/D=" + t.adLine,
    "SUPPORT/RESISTANCE: Pivot=" + t.pivotPoint + ", S1/S2/S3=" + t.support1 + "/" + t.support2 + "/" + t.support3 + ", R1/R2/R3=" + t.resistance1 + "/" + t.resistance2 + "/" + t.resistance3,
    "FIB: 23.6%=" + t.fibRetracement236 + ", 38.2%=" + t.fibRetracement382 + ", 50%=" + t.fibRetracement500 + ", 61.8%=" + t.fibRetracement618 + ", 78.6%=" + t.fibRetracement786,
    "PATTERNS: Candle=" + t.candlePattern + ", Chart=" + t.chartPattern + ", Trend=" + t.trendDirection + " (strength " + t.trendStrength + "/100)",
    "",
    "=== FUNDAMENTAL ANALYSIS ===",
    "VALUATION: P/E=" + f.peRatio + ", Fwd P/E=" + f.forwardPE + ", PEG=" + f.pegRatio + ", P/B=" + f.priceToBook + ", P/S=" + f.priceToSales + ", EV/EBITDA=" + f.evToEbitda,
    "PROFITABILITY: Gross=" + f.grossMargin + "%, Operating=" + f.operatingMargin + "%, Net=" + f.netMargin + "%, ROE=" + f.roe + "%, ROIC=" + f.roic + "%",
    "GROWTH: Rev YoY=" + f.revenueGrowthYoY + "%, EPS YoY=" + f.earningsGrowthYoY + "%, FCF YoY=" + f.fcfGrowthYoY + "%",
    "HEALTH: Current=" + f.currentRatio + ", D/E=" + f.debtToEquity + ", Altman Z=" + f.altmanZScore,
    "CASH FLOW: FCF=$" + (f.freeCashFlow / 1e9).toFixed(1) + "B, Yield=" + f.fcfYield + "%",
    "DIVIDEND: Yield=" + f.dividendYield + "%, Payout=" + f.dividendPayoutRatio + "%",
    "EARNINGS: EPS=$" + f.earningsPerShare + ", Surprise=" + f.earningsSurprisePercent + "%, Consensus=" + f.analystConsensus + ", Target=$" + f.analystTargetPrice,
    "OWNERSHIP: Institutional=" + f.institutionalOwnership + "%, Short=" + f.shortInterest + "%",
    "",
    "=== DAY TRADING METRICS ===",
    "SPEED: Speed-to-E=" + d.speedToEarningsRatio + ", P2E Growth=" + d.priceToEarningsGrowth + ", Tick=" + d.tickSpeed + "/s",
    "LIQUIDITY: Spread=" + d.bidAskSpread + ", Depth=" + d.marketDepth + "/100, Score=" + d.liquidityScore + "/100",
    "INTRADAY: VWAP Dev=" + d.vwapDeviation + "%, Range=" + d.intradayRange + "%, Mom=" + d.intradayMomentum + "/100",
    "SCALP: Potential=" + d.scalpPotential + "/100, R:R=" + d.riskRewardRatio + ", WinProb=" + d.winProbability + "%",
    "FLOW: Imbalance=" + d.orderFlowImbalance + ", DarkPool=" + d.darkPoolActivity + "%, Options=" + d.optionsFlow,
    "CORR: Beta=" + d.betaToSP500 + ", Sector=" + d.correlationToSector + ", Market=" + d.correlationToMarket,
    "",
    "=== AI SCORES ===",
    "Overall=" + stock.overallScore + ", Tech=" + stock.technicalScore + ", Fund=" + stock.fundamentalScore,
    "Momentum=" + stock.momentumScore + ", Value=" + stock.valueScore + ", Quality=" + stock.qualityScore + ", Sentiment=" + stock.sentimentScore,
    "",
    "Return ONLY JSON: { type, confidence, reason (2-3 sentences), entryPrice, targetPrice, stopLoss, riskRewardRatio, indicators (array of 4-6), analysisType }",
  ];

  return lines.filter(l => l !== undefined).join("\n");
}

function generateOfflineAnalysis(stock: StockData, mode: string): Partial<TradeSignal> {
  const t = stock.technical;
  const f = stock.fundamental;
  const d = stock.dayTrading;

  let bullish = 0;
  let bearish = 0;
  const indicators: string[] = [];

  // Momentum analysis
  if (t.rsi14 < 30) { bullish += 2; indicators.push("RSI(14): " + t.rsi14 + " (Oversold)"); }
  else if (t.rsi14 > 70) { bearish += 2; indicators.push("RSI(14): " + t.rsi14 + " (Overbought)"); }
  else { indicators.push("RSI(14): " + t.rsi14); }

  if (t.macdStatus === 'Bullish') { bullish += 2; indicators.push("MACD: Bullish"); }
  else if (t.macdStatus === 'Bearish') { bearish += 2; indicators.push("MACD: Bearish"); }

  if (t.supertrendSignal === 'BUY') { bullish++; indicators.push("Supertrend: BUY"); }
  else { bearish++; indicators.push("Supertrend: SELL"); }

  if (t.trendDirection === 'UP') { bullish++; indicators.push("Trend: UP (" + t.trendStrength + "%)"); }
  else if (t.trendDirection === 'DOWN') { bearish++; indicators.push("Trend: DOWN (" + t.trendStrength + "%)"); }

  // Volume confirmation
  if (t.cmf > 0.05) bullish++;
  else if (t.cmf < -0.05) bearish++;

  if (t.adx > 25) {
    if (t.plusDI > t.minusDI) bullish++;
    else bearish++;
    indicators.push("ADX: " + t.adx);
  }

  // Bollinger analysis
  if (t.bollingerPercentB < 0.2) bullish++;
  else if (t.bollingerPercentB > 0.8) bearish++;

  // Fundamental for long-term
  if (mode === 'LONG_TERM') {
    if (f.pegRatio > 0 && f.pegRatio < 1.5) bullish += 2;
    if (f.roe > 15) bullish++;
    if (f.debtToEquity > 2) bearish++;
    if (f.revenueGrowthYoY > 10) bullish++;
    indicators.push("PEG: " + f.pegRatio, "ROE: " + f.roe + "%");
  }

  // Day trading specifics
  if (mode === 'SCALP') {
    if (d.scalpPotential > 70) bullish += 2;
    if (d.riskRewardRatio > 1.5) bullish++;
    if (d.relativeVolume > 1.2) bullish++;
    indicators.push("Scalp: " + d.scalpPotential + "/100", "R:R: " + d.riskRewardRatio);
  }

  const net = bullish - bearish;
  const type: 'BUY' | 'SELL' | 'HOLD' = net >= 3 ? 'BUY' : net <= -3 ? 'SELL' : 'HOLD';
  const confidence = Math.min(95, Math.round(50 + Math.abs(net) * 5 + stock.overallScore * 0.2));

  let reason: string;
  if (type === 'BUY') {
    reason = bullish + " bullish signals detected including " + t.macdStatus + " MACD and " + t.trendDirection + " trend. " +
      (mode === 'SCALP' ? "Scalp potential " + d.scalpPotential + "/100 with " + d.riskRewardRatio + " R:R." : "Overall score " + stock.overallScore + "/100.");
  } else if (type === 'SELL') {
    reason = bearish + " bearish signals with " + t.macdStatus + " MACD and " + t.candlePattern + " pattern. " + t.trendDirection + " trend at " + t.trendStrength + "% strength.";
  } else {
    reason = "Mixed signals: " + bullish + " bullish vs " + bearish + " bearish. " + t.chartPattern + " pattern suggests consolidation. Wait for clearer direction.";
  }

  return {
    type, confidence, reason,
    timeframe: mode as 'SCALP' | 'SWING' | 'LONG_TERM',
    entryPrice: stock.price,
    targetPrice: type === 'BUY' ? d.targetPrice : type === 'SELL' ? d.stopLoss : stock.price,
    stopLoss: type === 'BUY' ? d.stopLoss : type === 'SELL' ? d.targetPrice : stock.price,
    riskRewardRatio: d.riskRewardRatio,
    indicators: indicators.slice(0, 6),
    analysisType: mode === 'LONG_TERM' ? 'COMBINED' : 'TECHNICAL',
  };
}
