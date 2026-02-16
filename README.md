<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Finnova AI Trader

**AI-Powered Trading Bot & Portfolio Builder**

Real-time technical + fundamental analysis with 100+ KPIs, risk-based portfolio construction, and day trading signals powered by Google Gemini AI.

## Features

- **Risk-Based Portfolio Builder** - Choose from Conservative, Moderate, Aggressive, or Day Trader profiles. AI constructs a personalized portfolio using fundamental and technical analysis.
- **100+ Technical Indicators** - RSI, MACD, Bollinger Bands, Ichimoku Cloud, Supertrend, VWAP, Fibonacci, ADX, Stochastic, Williams %R, CCI, ATR, OBV, CMF, Aroon, Keltner Channels, Donchian Channels, and more.
- **Fundamental Analysis** - P/E, PEG, P/B, EV/EBITDA, ROE, ROIC, FCF yield, Altman Z-Score, debt ratios, growth metrics, dividend analysis, and earnings quality.
- **Day Trading Engine** - Speed-to-E ratio, P2E growth ratio, scalp potential scoring, order flow analysis, options flow, dark pool activity, and bid-ask spread monitoring.
- **AI Trade Signals** - Real-time BUY/SELL/HOLD signals with confidence scores, entry/target/stop-loss levels, risk-reward ratios, and key indicator breakdowns.
- **Live 24/7 Market Scanning** - Auto-scans market every 30 seconds in trading mode with SCALP, SWING, and LONG-TERM timeframes.
- **Gemini AI Integration** - Sends all 100+ KPIs to Google Gemini for comprehensive AI-driven analysis. Falls back to local algorithmic analysis when offline.

## Tech Stack

- **React 19** + **TypeScript** - Modern UI with type safety
- **Vite** - Fast development and build
- **Recharts** - Interactive price charts
- **Tailwind CSS** - Glassmorphic dark-mode UI
- **Google Gemini AI** - LLM-powered market analysis
- **Lucide React** - Icon library

## Run Locally

**Prerequisites:** Node.js 18+

```bash
npm install
```

Set your Gemini API key in `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

Start the development server:
```bash
npm run dev
```

The app runs on `http://localhost:3000`. It works without an API key using the built-in offline analysis engine.

## Architecture

```
App.tsx                          # Main app with view routing
types.ts                         # 250+ type definitions (Technical, Fundamental, DayTrading)
constants.ts                     # 7 stocks with full KPI data, risk profiles, portfolio templates
services/geminiService.ts        # AI analysis engine (Gemini + offline fallback)
components/
  Header.tsx                     # Top navigation
  BottomNav.tsx                  # Bottom tab navigation
  ActionButtons.tsx              # Quick actions
  ChartComponent.tsx             # Price chart with Recharts
  RiskProfileSelector.tsx        # Risk tolerance selection (4 profiles)
  PortfolioBuilder.tsx           # AI portfolio construction
  AnalysisDashboard.tsx          # Deep analysis with expandable stock cards
```

## Disclaimer

This application is for educational and demonstration purposes only. It does not constitute financial advice. Always consult a licensed financial advisor before making investment decisions. Trading involves risk of loss.
