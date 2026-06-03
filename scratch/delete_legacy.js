import fs from 'fs';

const paths = [
  'public/metatrader5.png',
  'public/tradingview.png'
];

for (const p of paths) {
  try {
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`Deleted legacy file: ${p}`);
    } else {
      console.log(`File did not exist: ${p}`);
    }
  } catch (err) {
    console.error(`Error deleting ${p}:`, err.message);
  }
}
