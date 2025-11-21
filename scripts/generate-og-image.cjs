/**
 * Generates the Open Graph image for the website.
 * 
 * PREREQUISITES:
 * This script requires the 'canvas' package to be installed.
 * Run `npm install canvas` before running this script.
 * 
 * Usage: node scripts/generate-og-image.cjs
 */

const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Brand Colors
  const colors = {
    forestGreen: '#2D5016',
    sunsetOrange: '#FF6B35',
    mountainBlue: '#4A90E2',
    warmGray: '#F5F4F2',
    gold: '#F4D03F',
    white: '#FFFFFF'
  };

  // Background
  ctx.fillStyle = colors.forestGreen;
  ctx.fillRect(0, 0, width, height);

  // Add some visual interest (e.g., a subtle gradient or shape)
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.forestGreen);
  gradient.addColorStop(1, '#1a300d'); // Darker green
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Accent shape (e.g., bottom bar)
  ctx.fillStyle = colors.gold;
  ctx.fillRect(0, height - 20, width, 20);

  // Text Configuration
  ctx.fillStyle = colors.warmGray;
  ctx.font = 'bold 80px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Draw "MetzlerCares"
  ctx.fillText('MetzlerCares', width / 2, height / 2 - 40);

  // Draw Tagline
  ctx.fillStyle = colors.gold;
  ctx.font = 'bold 40px Sans';
  ctx.fillText('Peer Coaching & Sober Living Assistance', width / 2, height / 2 + 40);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  const outputPath = path.join(__dirname, '../static/og-image.png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`OG Image generated at ${outputPath}`);
}

generateOGImage();
