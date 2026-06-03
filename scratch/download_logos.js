import fs from 'fs';
import https from 'https';
import path from 'path';

const downloads = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Metatrader_5_logo.png',
    dest: 'public/metatrader5.png'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/TradingView_Logo.svg/512px-TradingView_Logo.svg.png',
    dest: 'public/tradingview.png'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/VTM-logo.png',
    dest: 'public/vtmarkets.png'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${url} -> ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of downloads) {
    try {
      await download(item.url, item.dest);
    } catch (err) {
      console.error(`Error downloading ${item.url}:`, err.message);
    }
  }
}

run();
