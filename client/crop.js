import { Jimp } from 'jimp';

async function cropAvatars() {
  const imgPath = 'C:/Users/AJITH/.gemini/antigravity/brain/3e3f1e9c-23c4-448d-8de2-deaa9a879945/media__1781553333332.png';
  const img = await Jimp.read(imgPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;

  console.log(`Width: ${w}, Height: ${h}`);

  // We have 5 cols, 2 rows
  const colWidth = w / 5;
  const startY = h * 0.15; // ignore top "WORLD CUP" text
  const rowHeight = (h - startY) / 2;

  const avatars = [
    'es_dribbler', 'no_champion', 'kr_champion', 'eg_champion', 'us_silent',
    'br_dribbler', 'fr_silent', 'pt_champion', 'ar_champion', 'eng_silent'
  ];

  let idx = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      const x = c * colWidth;
      const y = startY + (r * rowHeight);
      
      const clone = img.clone();
      clone.crop({ x, y, w: colWidth, h: rowHeight });
      
      // Tight square around the circle
      // The circles seem to occupy most of the grid cell
      const size = Math.min(colWidth, rowHeight) * 0.95; 
      const cx = colWidth / 2;
      const cy = rowHeight / 2;
      clone.crop({ x: cx - size/2, y: cy - size/2, w: size, h: size });

      await clone.write(`public/avatars/${avatars[idx]}.png`);
      idx++;
    }
  }
  console.log("Done cropping.");
}

cropAvatars().catch(console.error);
