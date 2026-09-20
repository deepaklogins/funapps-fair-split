const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const ASSETS = path.join(__dirname, '..', 'assets');

// Main icon - house with split line on vibrant background
const iconSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e94560"/>
      <stop offset="100%" style="stop-color:#c23152"/>
    </linearGradient>
    <linearGradient id="house" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#f0f0f0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${SIZE}" height="${SIZE}" rx="220" fill="url(#bg)"/>

  <!-- House shape -->
  <g transform="translate(${SIZE/2}, ${SIZE/2 - 20})">
    <!-- Roof -->
    <polygon points="0,-280 -300,0 300,0" fill="white" opacity="0.95"/>
    <!-- Body -->
    <rect x="-220" y="0" width="440" height="300" rx="20" fill="white" opacity="0.95"/>
    <!-- Split line down the middle -->
    <line x1="0" y1="-200" x2="0" y2="300" stroke="#e94560" stroke-width="12" stroke-dasharray="30,20"/>
    <!-- Left window -->
    <rect x="-160" y="60" width="100" height="100" rx="12" fill="#e94560" opacity="0.3"/>
    <!-- Right window -->
    <rect x="60" y="60" width="100" height="100" rx="12" fill="#e94560" opacity="0.3"/>
    <!-- Door left half -->
    <rect x="-55" y="170" width="45" height="130" rx="8" fill="#e94560" opacity="0.5"/>
    <!-- Door right half -->
    <rect x="10" y="170" width="45" height="130" rx="8" fill="#e94560" opacity="0.7"/>
  </g>

  <!-- Dollar signs -->
  <text x="300" y="620" font-family="Arial,sans-serif" font-size="120" font-weight="bold" fill="white" opacity="0.9">$</text>
  <text x="620" y="620" font-family="Arial,sans-serif" font-size="120" font-weight="bold" fill="white" opacity="0.9">$</text>
</svg>`;

// Foreground for adaptive icon (no background, transparent)
const foregroundSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${SIZE/2}, ${SIZE/2 - 20})">
    <polygon points="0,-250 -270,0 270,0" fill="white" opacity="0.95"/>
    <rect x="-200" y="0" width="400" height="270" rx="18" fill="white" opacity="0.95"/>
    <line x1="0" y1="-180" x2="0" y2="270" stroke="#e94560" stroke-width="10" stroke-dasharray="25,18"/>
    <rect x="-145" y="50" width="90" height="90" rx="10" fill="#e94560" opacity="0.3"/>
    <rect x="55" y="50" width="90" height="90" rx="10" fill="#e94560" opacity="0.3"/>
    <rect x="-50" y="150" width="40" height="120" rx="7" fill="#e94560" opacity="0.5"/>
    <rect x="10" y="150" width="40" height="120" rx="7" fill="#e94560" opacity="0.7"/>
  </g>
  <text x="280" y="600" font-family="Arial,sans-serif" font-size="100" font-weight="bold" fill="#e94560" opacity="0.8">$</text>
  <text x="580" y="600" font-family="Arial,sans-serif" font-size="100" font-weight="bold" fill="#e94560" opacity="0.8">$</text>
</svg>`;

// Background for adaptive icon
const bgSvg = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e94560"/>
      <stop offset="100%" style="stop-color:#c23152"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#bg)"/>
</svg>`;

// Splash icon (smaller, centered)
const splashSvg = `
<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(150, 130)">
    <polygon points="0,-100 -110,0 110,0" fill="white" opacity="0.95"/>
    <rect x="-80" y="0" width="160" height="110" rx="8" fill="white" opacity="0.95"/>
    <line x1="0" y1="-70" x2="0" y2="110" stroke="#e94560" stroke-width="4" stroke-dasharray="10,8"/>
  </g>
</svg>`;

async function generate() {
  // Main icon
  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS, 'icon.png'));
  console.log('✓ icon.png');

  // Android adaptive icon foreground
  await sharp(Buffer.from(foregroundSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS, 'android-icon-foreground.png'));
  console.log('✓ android-icon-foreground.png');

  // Android adaptive icon background
  await sharp(Buffer.from(bgSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS, 'android-icon-background.png'));
  console.log('✓ android-icon-background.png');

  // Monochrome icon (same as foreground but will be tinted by OS)
  await sharp(Buffer.from(foregroundSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS, 'android-icon-monochrome.png'));
  console.log('✓ android-icon-monochrome.png');

  // Splash icon
  await sharp(Buffer.from(splashSvg))
    .resize(300, 300)
    .png()
    .toFile(path.join(ASSETS, 'splash-icon.png'));
  console.log('✓ splash-icon.png');

  // Favicon
  await sharp(Buffer.from(iconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS, 'favicon.png'));
  console.log('✓ favicon.png');
}

generate().catch(console.error);
