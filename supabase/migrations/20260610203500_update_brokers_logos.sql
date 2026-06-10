-- Update Binance Institutional in the brokers table to use the new verified local PNG icon
UPDATE public.brokers 
SET logo_url = '/binance.png' 
WHERE name = 'Binance Institutional';
