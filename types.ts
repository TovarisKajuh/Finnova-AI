// ==========================================
// Finnova AI - Core Type Definitions
// ==========================================

// --- View & Navigation ---
export enum ViewState {
  HOME = 'HOME',
  TRADING = 'TRADING',
  PORTFOLIO = 'PORTFOLIO',
  ANALYSIS = 'ANALYSIS',
  RISK_PROFILE = 'RISK_PROFILE',
  PORTFOLIO_BUILDER = 'PORTFOLIO_BUILDER',
}

// --- Risk Tolerance ---
export enum RiskTolerance {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
  DAY_TRADER = 'DAY_TRADER',
}

export interface RiskProfile {
  tolerance: RiskTolerance;
  maxDrawdown: number;
  targetReturn: number;
  timeHorizon: string;
  rebalanceFrequency: string;
  leverageAllowed: boolean;
  maxLeverage: number;
  dayTradingEnabled: boolean;
  stopLossPercent: number;
  takeProfitPercent: number;
}

// --- Technical Indicators ---
export interface TechnicalIndicators {
  // Momentum
  rsi14: number;
  rsi7: number;
  stochasticK: number;
  stochasticD: number;
  williamsR: number;
  mfi: number;
  roc: number;
  momentum: number;
  cci: number;
  ultimateOscillator: number;

  // Trend
  macdLine: number;
  macdSignal: number;
  macdHistogram: number;
  macdStatus: 'Bullish' | 'Bearish' | 'Neutral';
  ema9: number;
  ema20: number;
  ema50: number;
  ema200: number;
  sma20: number;
  sma50: number;
  sma200: number;
  adx: number;
  plusDI: number;
  minusDI: number;
  aroonUp: number;
  aroonDown: number;
  aroonOscillator: number;
  psar: number;
  ichimokuTenkan: number;
  ichimokuKijun: number;
  ichimokuSenkouA: number;
  ichimokuSenkouB: number;
  supertrend: number;
  supertrendSignal: 'BUY' | 'SELL';

  // Volatility
  bollingerUpper: number;
  bollingerMiddle: number;
  bollingerLower: number;
  bollingerWidth: number;
  bollingerPercentB: number;
  atr14: number;
  atr7: number;
  stdDev20: number;
  keltnerUpper: number;
  keltnerMiddle: number;
  keltnerLower: number;
  donchianHigh: number;
  donchianLow: number;
  historicalVolatility: number;
  impliedVolatility: number;
  chaikinVolatility: number;

  // Volume
  obv: number;
  obvSlope: number;
  vwap: number;
  volumeSma20: number;
  volumeRatio: number;
  adLine: number;
  cmf: number;
  forceIndex: number;
  easeOfMovement: number;
  volumeOscillator: number;
  nvi: number;
  pvi: number;
  volumeProfile: string;

  // Support/Resistance
  pivotPoint: number;
  support1: number;
  support2: number;
  support3: number;
  resistance1: number;
  resistance2: number;
  resistance3: number;
  fibRetracement236: number;
  fibRetracement382: number;
  fibRetracement500: number;
  fibRetracement618: number;
  fibRetracement786: number;

  // Pattern
  candlePattern: string;
  chartPattern: string;
  trendDirection: 'UP' | 'DOWN' | 'SIDEWAYS';
  trendStrength: number;
}

// --- Fundamental Metrics ---
export interface FundamentalMetrics {
  // Valuation
  peRatio: number;
  forwardPE: number;
  pegRatio: number;
  priceToBook: number;
  priceToSales: number;
  priceToFreeCashFlow: number;
  evToEbitda: number;
  evToRevenue: number;
  enterpriseValue: number;

  // Profitability
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  roe: number;
  roa: number;
  roic: number;
  roce: number;

  // Growth
  revenueGrowthYoY: number;
  revenueGrowthQoQ: number;
  earningsGrowthYoY: number;
  earningsGrowthQoQ: number;
  fcfGrowthYoY: number;
  bookValueGrowth: number;
  epsGrowth5Y: number;
  revenueGrowth5Y: number;

  // Financial Health
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  debtToAssets: number;
  interestCoverage: number;
  longTermDebt: number;
  totalDebt: number;
  cashAndEquivalents: number;
  netCashPosition: number;
  altmanZScore: number;

  // Cash Flow
  freeCashFlow: number;
  operatingCashFlow: number;
  capitalExpenditures: number;
  fcfYield: number;
  fcfPerShare: number;
  cashFlowToDebt: number;

  // Dividends
  dividendYield: number;
  dividendPayoutRatio: number;
  dividendGrowth5Y: number;
  dividendsContinuous: number;

  // Earnings Quality
  earningsPerShare: number;
  earningsSurprisePercent: number;
  analystConsensus: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  analystTargetPrice: number;
  analystCount: number;
  earningsRevisionsTrend: 'UP' | 'DOWN' | 'FLAT';

  // Ownership
  institutionalOwnership: number;
  insiderOwnership: number;
  shortInterest: number;
  shortRatio: number;
  floatShares: number;
}

// --- Day Trading Metrics ---
export interface DayTradingMetrics {
  speedToEarningsRatio: number;
  priceToEarningsGrowth: number;
  tickSpeed: number;
  bidAskSpread: number;
  marketDepth: number;
  liquidityScore: number;

  vwapDeviation: number;
  intradayRange: number;
  averageTrueRangeIntraday: number;
  intradayMomentum: number;
  relativeVolume: number;

  scalpPotential: number;
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  riskRewardRatio: number;
  winProbability: number;
  expectedValue: number;

  orderFlowImbalance: number;
  largeBlockActivity: boolean;
  darkPoolActivity: number;
  optionsFlow: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  putCallRatio: number;
  maxPain: number;

  betaToSP500: number;
  correlationToSector: number;
  correlationToMarket: number;
  sectorMomentum: number;
}

// --- Comprehensive Stock Data ---
export interface StockData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  exchange: string;

  price: number;
  previousClose: number;
  open: number;
  dayHigh: number;
  dayLow: number;
  week52High: number;
  week52Low: number;
  change: number;
  changePercent: number;
  volume: number;
  avgVolume10D: number;
  avgVolume3M: number;

  technical: TechnicalIndicators;
  fundamental: FundamentalMetrics;
  dayTrading: DayTradingMetrics;

  overallScore: number;
  technicalScore: number;
  fundamentalScore: number;
  momentumScore: number;
  valueScore: number;
  qualityScore: number;
  sentimentScore: number;

  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  suitableFor: RiskTolerance[];
}

// --- Trade Signal ---
export interface TradeSignal {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reason: string;
  timestamp: Date;
  timeframe: 'SCALP' | 'SWING' | 'LONG_TERM';
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  riskRewardRatio?: number;
  indicators?: string[];
  analysisType?: 'TECHNICAL' | 'FUNDAMENTAL' | 'COMBINED';
}

// --- Portfolio ---
export interface PortfolioItem {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number;
  color: string;
  sector: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  returnPercent: number;
}

export interface Portfolio {
  name: string;
  riskProfile: RiskProfile;
  items: PortfolioItem[];
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationScore: number;
  createdAt: Date;
  lastRebalanced: Date;
}

export interface AssetAllocation {
  category: string;
  targetPercent: number;
  minPercent: number;
  maxPercent: number;
}

export interface PortfolioTemplate {
  name: string;
  riskTolerance: RiskTolerance;
  description: string;
  expectedReturn: string;
  expectedVolatility: string;
  allocations: AssetAllocation[];
}

export interface ScannerFilter {
  metric: string;
  operator: 'GT' | 'LT' | 'EQ' | 'BETWEEN';
  value: number;
  value2?: number;
}

export interface ScanResult {
  stock: StockData;
  matchScore: number;
  signals: TradeSignal[];
}
