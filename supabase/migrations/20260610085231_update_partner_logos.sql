-- Seed High-Fidelity Integration Partner Logos
DELETE FROM public.banners WHERE placement = 'partner';

INSERT INTO public.banners (title, placement, image_url, description, is_active, priority)
VALUES
('MetaTrader 5', 'partner', 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/bc/0c/76/bc0c7626-b4e6-ee40-613a-54c6adb623bd/icon-0-0-1x_U007emarketing-0-0-0-4-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png', 'Trading Platform', true, 1),
('MetaTrader 4', 'partner', 'https://is1-ssl.mzstatic.com/image/thumb/Purple113/v4/f4/bd/18/f4bd18ff-edcb-0d5f-2ced-94144a113321/icon-0-0-1x_U007emarketing-0-0-0-4-0-0-85-220.png/1200x630wa.png', 'Trading Platform', true, 2),
('TradingView', 'partner', 'https://crystalpng.com/wp-content/uploads/2025/03/tradingview-logo-768x768.png', 'Charting Terminal', true, 3),
('cTrader', 'partner', 'https://is4-ssl.mzstatic.com/image/thumb/Purple115/v4/13/f7/d6/13f7d654-a8d5-8d84-e8a0-674e2a7eacac/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png', 'Trading Client', true, 4),
('Match-Trader', 'partner', 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/91/45/ab/9145abee-c374-f850-3e0f-747847dcfe9f/AppIcons-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png', 'Forex Platform', true, 5)
ON CONFLICT DO NOTHING;
