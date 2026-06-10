-- Update partner logos to point to the official, verified PNG files
DELETE FROM public.banners WHERE placement = 'partner';

INSERT INTO public.banners (title, placement, image_url, description, is_active, priority)
VALUES
('MetaTrader 5', 'partner', '/metatrader5.png', 'Trading Platform', true, 1),
('MetaTrader 4', 'partner', '/metatrader4.png', 'Trading Platform', true, 2),
('TradingView', 'partner', '/tradingview.png', 'Charting Terminal', true, 3),
('cTrader', 'partner', '/ctrader.png', 'Trading Client', true, 4),
('Binance', 'partner', '/binance.png', 'Crypto Exchange', true, 5)
ON CONFLICT DO NOTHING;
