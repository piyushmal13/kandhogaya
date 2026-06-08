-- Add TradingView indicators to the marketplace
-- Category: 'course' (maps to Education in the marketplace)
-- Price: $10.00 each

INSERT INTO products (name, strategy_type, description, price, category, type, risk_level, metadata, features, supported_assets)
VALUES
  (
    'Smart Money Concepts (SMC) Suite',
    'TradingView Indicator',
    'Advanced Pine Script indicator that automatically maps out Order Blocks, Fair Value Gaps (FVG), and liquidity pools in real-time. Crucial for understanding institutional footprints.',
    10.00,
    'course',
    'indicator',
    'Low',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/smc_suite.pine"}'::jsonb,
    ARRAY['Auto Order Blocks', 'Fair Value Gaps', 'Liquidity Voids', 'Multi-timeframe Analysis'],
    ARRAY['All Forex Pairs', 'Indices', 'Crypto']
  ),
  (
    'Institutional Volume Profile',
    'TradingView Indicator',
    'Displays the Volume Point of Control (VPOC) and Value Areas (VAH/VAL) dynamically on the chart. Perfect for identifying high-probability reversal zones based on historical volume distribution.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/volume_profile.pine"}'::jsonb,
    ARRAY['Dynamic VPOC', 'Value Area High/Low', 'Custom Session Tracking'],
    ARRAY['XAUUSD', 'US30', 'NASDAQ']
  ),
  (
    'Advanced Liquidity Hunter',
    'TradingView Indicator',
    'Scans for pending stop-loss clusters and engineered liquidity. Highlights potential stop-hunt zones where large institutions are likely to trigger retail liquidations.',
    10.00,
    'course',
    'indicator',
    'High',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/liquidity_hunter.pine"}'::jsonb,
    ARRAY['Stop Hunt Detection', 'Retail Sentiment Map', 'Sweep Alerts'],
    ARRAY['Major Pairs', 'Gold']
  ),
  (
    'Dynamic Trend Navigator',
    'TradingView Indicator',
    'A sophisticated trend-following system using adaptive moving averages and ATR bands to keep you in the trend while filtering out market noise and false breakouts.',
    10.00,
    'course',
    'indicator',
    'Low',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/trend_nav.pine"}'::jsonb,
    ARRAY['Adaptive ATR Bands', 'Noise Filtering', 'Trailing Stop Logic'],
    ARRAY['EURUSD', 'GBPUSD', 'BTCUSD']
  ),
  (
    'Market Session Sessions Overlay',
    'TradingView Indicator',
    'Visually highlights the Asian, London, and New York sessions. Identifies the Asian range and highlights the London killzone for precise intra-day entries.',
    10.00,
    'course',
    'indicator',
    'Low',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/sessions.pine"}'::jsonb,
    ARRAY['Asian Range Box', 'London Killzone', 'NY Reversal Times'],
    ARRAY['Intraday Forex']
  ),
  (
    'Algorithmic Divergence Engine',
    'TradingView Indicator',
    'Automatically detects hidden and regular divergences across RSI, MACD, and Stochastic oscillators. Plots high-probability reversal arrows directly on the price chart.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/divergence.pine"}'::jsonb,
    ARRAY['Hidden Divergence', 'Regular Divergence', 'Multi-Oscillator Confluence'],
    ARRAY['All Markets']
  ),
  (
    'Volatility Breakout Bands',
    'TradingView Indicator',
    'Measures market compression and predicts explosive breakouts. Tightening bands signal impending volatility, giving you early entry before the momentum shifts.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/vol_breakout.pine"}'::jsonb,
    ARRAY['Compression Detection', 'Momentum Shift Alerts', 'Target Projections'],
    ARRAY['Indices', 'Crypto', 'Gold']
  ),
  (
    'Harmonic Pattern Scanner',
    'TradingView Indicator',
    'An automated scanning engine that identifies complex geometric price structures like Gartley, Bat, Butterfly, and Crab patterns with exact Entry and Take Profit zones.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/harmonics.pine"}'::jsonb,
    ARRAY['Auto-draw Harmonics', 'Fibonacci Confluence', 'PRZ (Potential Reversal Zone)'],
    ARRAY['Forex', 'Equities']
  ),
  (
    'Delta Order Flow Estimator',
    'TradingView Indicator',
    'Approximates buying vs selling pressure (Delta) within individual candles. Helps identify when buyers or sellers are trapped at key support/resistance levels.',
    10.00,
    'course',
    'indicator',
    'High',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/delta_flow.pine"}'::jsonb,
    ARRAY['Candle Delta', 'Trapped Trader Alerts', 'Absorption Detection'],
    ARRAY['Futures', 'Crypto']
  ),
  (
    'Macro Economic Event Overlay',
    'TradingView Indicator',
    'Pulls live macroeconomic data (NFP, CPI, FOMC) and plots vertical lines on your chart anticipating extreme volatility windows to keep your capital safe.',
    10.00,
    'course',
    'indicator',
    'Low',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/macro_events.pine"}'::jsonb,
    ARRAY['News Timers', 'Impact Color Coding', 'Volatility Warnings'],
    ARRAY['All Markets']
  ),
  (
    'Quantitative Mean Reversion',
    'TradingView Indicator',
    'A statistical model calculating standard deviation extremes. Plots dynamic reversion channels that trigger when an asset deviates too far from its historical mean.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/mean_reversion.pine"}'::jsonb,
    ARRAY['Standard Deviation Channels', 'Z-Score Extremes', 'Statistical Edges'],
    ARRAY['Mean-reverting pairs (AUDCAD, EURGBP)']
  ),
  (
    'Supply & Demand Imbalance',
    'TradingView Indicator',
    'Draws strict Supply and Demand zones based on explosive price origin points. Grades zones from weak to strong based on how much time price spent at the level.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/sd_imbalance.pine"}'::jsonb,
    ARRAY['Zone Grading', 'Origin Tracking', 'Touch Counter'],
    ARRAY['All Markets']
  ),
  (
    'VWAP Institutional Tracker',
    'TradingView Indicator',
    'Anchored Volume Weighted Average Price (VWAP) designed for institutional day trading. Includes standard deviation bands tracking weekly, daily, and session flows.',
    10.00,
    'course',
    'indicator',
    'Low',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/vwap_tracker.pine"}'::jsonb,
    ARRAY['Anchored VWAP', 'Session SD Bands', 'Institutional Average'],
    ARRAY['Indices', 'Crypto', 'Commodities']
  ),
  (
    'Currency Strength Heatmap',
    'TradingView Indicator',
    'A lower-pane oscillator comparing the relative strength of 8 major currencies in real-time. Instantly tells you the strongest currency to pair against the weakest.',
    10.00,
    'course',
    'indicator',
    'Medium',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/currency_strength.pine"}'::jsonb,
    ARRAY['Real-time Indexing', 'Pair Matrix', 'Divergence Strengths'],
    ARRAY['Forex']
  ),
  (
    'Tick Scalping Dashboard',
    'TradingView Indicator',
    'An on-chart dashboard built for ultra-fast scalpers. Consolidates spread, daily range, active volume, and micro-trend direction into a clean UI overlay.',
    10.00,
    'course',
    'indicator',
    'High',
    '{"download_url": "https://raw.githubusercontent.com/piyushmal13/kandhogaya/main/assets/indicators/tick_scalper.pine"}'::jsonb,
    ARRAY['Micro-trend Analysis', 'Spread Monitor', 'Live Range Metrics'],
    ARRAY['XAUUSD', 'US30', 'GER40']
  );
