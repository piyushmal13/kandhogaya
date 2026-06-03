import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log("Environment variables keys:");
console.log(Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('DATABASE') || k.includes('URL') || k.includes('KEY')));
