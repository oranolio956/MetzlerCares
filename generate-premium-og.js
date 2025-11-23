import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the HTML template with sophisticated design
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Grotesk:wght@700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      position: relative;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: linear-gradient(135deg, #0a0f1b 0%, #1a2942 50%, #0f172a 100%);
    }
    
    /* Premium gradient background layers */
    .bg-layer {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(45, 212, 191, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(96, 165, 250, 0.08) 0%, transparent 70%);
    }
    
    /* Sophisticated mesh gradient */
    .mesh {
      position: absolute;
      inset: 0;
      opacity: 0.4;
      background-image: 
        radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 0.3) 0px, transparent 50%),
        radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 0.2) 0px, transparent 50%),
        radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 0.2) 0px, transparent 50%),
        radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 0.2) 0px, transparent 50%),
        radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 0.2) 0px, transparent 50%);
    }
    
    /* Content container */
    .container {
      position: relative;
      z-index: 10;
      height: 100%;
      padding: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    /* Logo section */
    .logo-section {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .logo-mark {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #2dd4bf 0%, #60a5fa 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      box-shadow: 
        0 10px 40px rgba(45, 212, 191, 0.3),
        inset 0 -2px 10px rgba(255, 255, 255, 0.2);
    }
    
    .logo-mark::before {
      content: 'M';
      font-family: 'Space Grotesk', sans-serif;
      font-size: 42px;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .logo-mark::after {
      content: '';
      position: absolute;
      inset: -15px;
      border: 2px solid rgba(45, 212, 191, 0.2);
      border-radius: 24px;
      animation: pulse 3s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1); }
    }
    
    .brand-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 42px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.02em;
    }
    
    .brand-name span {
      background: linear-gradient(135deg, #2dd4bf 0%, #60a5fa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Main content */
    .tagline {
      font-size: 20px;
      font-weight: 600;
      color: #2dd4bf;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .tagline::after {
      content: '';
      flex: 0 0 60px;
      height: 2px;
      background: linear-gradient(90deg, #2dd4bf 0%, transparent 100%);
    }
    
    .headline {
      font-size: 72px;
      font-weight: 800;
      line-height: 1.1;
      color: white;
      margin-bottom: 24px;
      letter-spacing: -0.03em;
      max-width: 900px;
    }
    
    .headline .gradient {
      background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .description {
      font-size: 24px;
      line-height: 1.5;
      color: rgba(203, 213, 225, 0.9);
      max-width: 800px;
      margin-bottom: 40px;
    }
    
    /* Badges */
    .badges {
      display: flex;
      gap: 20px;
    }
    
    .badge {
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    /* Decorative elements */
    .decoration {
      position: absolute;
      pointer-events: none;
    }
    
    .circle-1 {
      top: 60px;
      right: 100px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(45, 212, 191, 0.3) 0%, transparent 70%);
      filter: blur(40px);
    }
    
    .circle-2 {
      bottom: 80px;
      right: 200px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
      filter: blur(60px);
    }
    
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(circle at center, black 0%, transparent 70%);
    }
    
    /* Abstract shape decoration */
    .shape {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 400px;
      height: 300px;
      overflow: hidden;
    }
    
    .shape::before {
      content: '';
      position: absolute;
      bottom: -100px;
      right: -100px;
      width: 400px;
      height: 400px;
      background: linear-gradient(45deg, transparent 30%, rgba(45, 212, 191, 0.1) 50%, transparent 70%);
      transform: rotate(45deg);
    }
    
    /* Colorado mountains silhouette */
    .mountains {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 200px;
      background: 
        linear-gradient(to bottom, transparent 0%, rgba(10, 15, 27, 0.4) 100%);
      -webkit-clip-path: polygon(
        0% 100%,
        0% 80%,
        10% 60%,
        20% 70%,
        30% 50%,
        40% 65%,
        50% 45%,
        60% 55%,
        70% 40%,
        80% 60%,
        90% 50%,
        100% 65%,
        100% 100%
      );
      clip-path: polygon(
        0% 100%,
        0% 80%,
        10% 60%,
        20% 70%,
        30% 50%,
        40% 65%,
        50% 45%,
        60% 55%,
        70% 40%,
        80% 60%,
        90% 50%,
        100% 65%,
        100% 100%
      );
    }
    
    /* Premium glass effect overlay */
    .glass-overlay {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 1000px;
      height: 400px;
      background: rgba(255, 255, 255, 0.01);
      border-radius: 100%;
      filter: blur(100px);
    }
  </style>
</head>
<body>
  <!-- Background layers -->
  <div class="bg-layer"></div>
  <div class="mesh"></div>
  <div class="grid-pattern"></div>
  <div class="glass-overlay"></div>
  
  <!-- Decorative elements -->
  <div class="decoration circle-1"></div>
  <div class="decoration circle-2"></div>
  <div class="shape"></div>
  <div class="mountains"></div>
  
  <!-- Main content -->
  <div class="container">
    <div class="logo-section">
      <div class="logo-mark"></div>
      <div class="brand-name">Metzler<span>Cares</span></div>
    </div>
    
    <div class="tagline">Recovery Infrastructure</div>
    
    <h1 class="headline">
      Your Digital<br>
      <span class="gradient">Case Manager</span><br>
      for Colorado
    </h1>
    
    <p class="description">
      Automating Medicaid filings, NEMT bookings, and court reporting 
      so your team can focus on what matters: saving lives.
    </p>
    
    <div class="badges">
      <div class="badge">HIPAA Compliant</div>
      <div class="badge">SOC 2 Certified</div>
      <div class="badge">Colorado RSSO</div>
    </div>
  </div>
</body>
</html>
`;

async function generateOGImage() {
  console.log('🚀 Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set viewport to OG image dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2 // Higher quality
  });

  console.log('🎨 Rendering HTML template...');
  await page.setContent(htmlTemplate, {
    waitUntil: 'networkidle0'
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');
  
  // Additional wait to ensure animations start
  await page.waitForTimeout(1000);

  console.log('📸 Capturing screenshot...');
  const screenshot = await page.screenshot({
    type: 'png',
    encoding: 'binary'
  });

  await browser.close();

  // Save the image
  const outputPath = path.join(__dirname, 'static', 'og-image.png');
  fs.writeFileSync(outputPath, screenshot);

  console.log('✅ Premium OG image generated successfully!');
  console.log('📐 Dimensions: 1200x630px @ 2x resolution');
  console.log('🎨 Features:');
  console.log('   - Large, readable typography (72px headline)');
  console.log('   - Professional gradient effects');
  console.log('   - Sophisticated glass morphism');
  console.log('   - Animated logo mark');
  console.log('   - Colorado mountain silhouette');
  console.log('   - Premium mesh gradients');
  console.log('   - Clean, modern layout');
}

generateOGImage().catch(console.error);