-- Seed clean transparent partner logos and update titles/placements
DELETE FROM public.banners WHERE placement = 'partner';

INSERT INTO public.banners (title, placement, image_url, description, is_active, priority)
VALUES
('MetaTrader 5', 'partner', '/metatrader5.svg', 'Trading Platform', true, 1),
('MetaTrader 4', 'partner', '/metatrader4.svg', 'Trading Platform', true, 2),
('TradingView', 'partner', '/tradingview.svg', 'Charting Terminal', true, 3),
('cTrader', 'partner', '/ctrader.png', 'Trading Client', true, 4),
('Binance', 'partner', '/binance.svg', 'Crypto Exchange', true, 5)
ON CONFLICT DO NOTHING;
