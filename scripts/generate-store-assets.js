const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'store-assets');
fs.mkdirSync(OUT, { recursive: true });

// 512x512 icon
async function icon() {
  await sharp(path.join(__dirname, '..', 'assets', 'icon.png'))
    .resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));
  console.log('✓ icon-512.png');
}

// Feature graphic 1024x500
async function featureGraphic() {
  const svg = `<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e94560"/><stop offset="100%" style="stop-color:#c23152"/>
    </linearGradient></defs>
    <rect width="1024" height="500" fill="url(#bg)"/>
    <g transform="translate(200,250)">
      <polygon points="0,-130 -140,0 140,0" fill="white" opacity="0.9"/>
      <rect x="-100" y="0" width="200" height="140" rx="10" fill="white" opacity="0.9"/>
      <line x1="0" y1="-90" x2="0" y2="140" stroke="#e94560" stroke-width="6" stroke-dasharray="15,10"/>
    </g>
    <text x="450" y="190" font-family="Arial,sans-serif" font-size="52" font-weight="bold" fill="white">Rent Splitter</text>
    <text x="450" y="250" font-family="Arial,sans-serif" font-size="26" fill="rgba(255,255,255,0.8)">Split rent fairly by room features</text>
    <text x="450" y="330" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.6)">Size | Bathroom | Light | Balcony | Noise</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(OUT, 'feature-graphic.png'));
  console.log('✓ feature-graphic.png');
}

// Phone screenshots (1080x1920, 9:16)
function phoneFrame(contentSvg) {
  return `<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1920" fill="#16213e"/>
    ${contentSvg}
  </svg>`;
}

async function screenshots() {
  // Screenshot 1: Home screen
  const ss1 = phoneFrame(`
    <text x="540" y="200" font-family="Arial,sans-serif" font-size="80" text-anchor="middle" fill="white">🏠</text>
    <text x="540" y="300" font-family="Arial,sans-serif" font-size="56" font-weight="bold" text-anchor="middle" fill="white">Fair Rent Splitter</text>
    <text x="540" y="360" font-family="Arial,sans-serif" font-size="28" text-anchor="middle" fill="#888">Score each room. Split rent fairly.</text>

    <rect x="80" y="440" width="920" height="140" rx="24" fill="#1a1a2e"/>
    <text x="120" y="490" font-family="Arial,sans-serif" font-size="24" fill="#888">Total Monthly Rent</text>
    <text x="120" y="550" font-family="Arial,sans-serif" font-size="56" font-weight="bold" fill="#e94560">$ </text>
    <text x="190" y="550" font-family="Arial,sans-serif" font-size="56" font-weight="bold" fill="white">2,400</text>

    <text x="80" y="650" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white">Rooms (2)</text>
    <text x="880" y="650" font-family="Arial,sans-serif" font-size="24" fill="#e94560">+ Add Room</text>

    <rect x="80" y="690" width="920" height="160" rx="20" fill="#1a1a2e"/>
    <text x="120" y="740" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="white">Master Bedroom</text>
    <rect x="120" y="760" width="100" height="36" rx="8" fill="#232946"/>
    <text x="135" y="785" font-family="Arial,sans-serif" font-size="20" fill="#888">200 sqft</text>
    <rect x="230" y="760" width="100" height="36" rx="8" fill="#232946"/>
    <text x="240" y="785" font-family="Arial,sans-serif" font-size="20" fill="#2ecc71">🚿 Bath</text>
    <rect x="340" y="760" width="110" height="36" rx="8" fill="#232946"/>
    <text x="350" y="785" font-family="Arial,sans-serif" font-size="20" fill="#888">🌿 Balcony</text>
    <rect x="460" y="760" width="90" height="36" rx="8" fill="#232946"/>
    <text x="475" y="785" font-family="Arial,sans-serif" font-size="20" fill="#2ecc71">🤫 Quiet</text>

    <rect x="80" y="870" width="920" height="160" rx="20" fill="#1a1a2e"/>
    <text x="120" y="920" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="white">Small Bedroom</text>
    <rect x="120" y="940" width="100" height="36" rx="8" fill="#232946"/>
    <text x="135" y="965" font-family="Arial,sans-serif" font-size="20" fill="#888">120 sqft</text>
    <rect x="230" y="940" width="90" height="36" rx="8" fill="#232946"/>
    <text x="245" y="965" font-family="Arial,sans-serif" font-size="20" fill="#e94560">📢 Noisy</text>

    <rect x="80" y="1120" width="920" height="100" rx="20" fill="#e94560"/>
    <text x="540" y="1185" font-family="Arial,sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">Calculate Fair Split</text>
  `);
  await sharp(Buffer.from(ss1)).png().toFile(path.join(OUT, 'screenshot-1-home.png'));
  console.log('✓ screenshot-1-home.png');

  // Screenshot 2: Results screen
  const ss2 = phoneFrame(`
    <rect x="80" y="80" width="920" height="280" rx="28" fill="#e94560"/>
    <text x="540" y="160" font-family="Arial,sans-serif" font-size="24" text-anchor="middle" fill="rgba(255,255,255,0.7)">Total Rent</text>
    <text x="540" y="270" font-family="Arial,sans-serif" font-size="96" font-weight="900" text-anchor="middle" fill="white">$2,400</text>
    <text x="540" y="320" font-family="Arial,sans-serif" font-size="22" text-anchor="middle" fill="rgba(255,255,255,0.7)">/month split across 2 rooms</text>

    <text x="80" y="440" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="white">Fair Split Breakdown</text>

    <rect x="80" y="480" width="920" height="240" rx="20" fill="#1a1a2e"/>
    <text x="120" y="530" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="white">Master Bedroom</text>
    <text x="120" y="560" font-family="Arial,sans-serif" font-size="20" fill="#888">Score: 91 pts · 69.5%</text>
    <text x="800" y="540" font-family="Arial,sans-serif" font-size="52" font-weight="800" fill="#e94560">$1,667</text>
    <text x="930" y="540" font-family="Arial,sans-serif" font-size="22" fill="#888">/mo</text>
    <rect x="120" y="590" width="840" height="12" rx="6" fill="#232946"/>
    <rect x="120" y="590" width="840" height="12" rx="6" fill="#e94560"/>
    <rect x="120" y="630" width="100" height="32" rx="8" fill="#232946"/>
    <text x="133" y="652" font-family="Arial,sans-serif" font-size="18" fill="#888">200 sqft</text>
    <rect x="230" y="630" width="90" height="32" rx="8" fill="#232946"/>
    <text x="240" y="652" font-family="Arial,sans-serif" font-size="18" fill="#888">🚿 Bath</text>
    <rect x="330" y="630" width="100" height="32" rx="8" fill="#232946"/>
    <text x="340" y="652" font-family="Arial,sans-serif" font-size="18" fill="#888">🌿 Balcony</text>

    <rect x="80" y="740" width="920" height="220" rx="20" fill="#1a1a2e"/>
    <text x="120" y="790" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="white">Small Bedroom</text>
    <text x="120" y="820" font-family="Arial,sans-serif" font-size="20" fill="#888">Score: 40 pts · 30.5%</text>
    <text x="830" y="800" font-family="Arial,sans-serif" font-size="52" font-weight="800" fill="#f39c12">$733</text>
    <text x="940" y="800" font-family="Arial,sans-serif" font-size="22" fill="#888">/mo</text>
    <rect x="120" y="850" width="840" height="12" rx="6" fill="#232946"/>
    <rect x="120" y="850" width="370" height="12" rx="6" fill="#f39c12"/>

    <rect x="80" y="1040" width="920" height="100" rx="20" fill="#e94560"/>
    <text x="540" y="1105" font-family="Arial,sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">Share with Roommates</text>
  `);
  await sharp(Buffer.from(ss2)).png().toFile(path.join(OUT, 'screenshot-2-results.png'));
  console.log('✓ screenshot-2-results.png');

  // Screenshot 3: Add Room
  const ss3 = phoneFrame(`
    <text x="540" y="120" font-family="Arial,sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="white">Add Room</text>

    <rect x="80" y="170" width="920" height="130" rx="20" fill="#1a1a2e"/>
    <text x="120" y="210" font-family="Arial,sans-serif" font-size="22" fill="#888">Room Name</text>
    <rect x="120" y="230" width="840" height="50" rx="12" fill="#232946"/>
    <text x="140" y="263" font-family="Arial,sans-serif" font-size="24" fill="white">Master Bedroom</text>

    <rect x="80" y="320" width="920" height="130" rx="20" fill="#1a1a2e"/>
    <text x="120" y="360" font-family="Arial,sans-serif" font-size="22" fill="#888">Room Size (sq ft)</text>
    <rect x="120" y="380" width="840" height="50" rx="12" fill="#232946"/>
    <text x="140" y="413" font-family="Arial,sans-serif" font-size="24" fill="white">200</text>

    <rect x="80" y="470" width="920" height="700" rx="20" fill="#1a1a2e"/>
    <text x="120" y="520" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="white">Features</text>

    <text x="160" y="580" font-family="Arial,sans-serif" font-size="24" fill="white">🪟  Has Windows</text>
    <circle cx="900" cy="570" r="18" fill="#e94560"/>

    <text x="120" y="630" font-family="Arial,sans-serif" font-size="20" fill="#888">Natural Light</text>
    <rect x="120" y="650" width="270" height="50" rx="12" fill="#232946"/>
    <text x="210" y="682" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="#888">Low</text>
    <rect x="400" y="650" width="270" height="50" rx="12" fill="#232946"/>
    <text x="535" y="682" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="#888">Medium</text>
    <rect x="680" y="650" width="280" height="50" rx="12" fill="#e94560"/>
    <text x="820" y="682" font-family="Arial,sans-serif" font-size="20" text-anchor="middle" fill="white">Bright</text>

    <text x="160" y="760" font-family="Arial,sans-serif" font-size="24" fill="white">🚪  Has Closet</text>
    <circle cx="900" cy="750" r="18" fill="#e94560"/>

    <text x="160" y="840" font-family="Arial,sans-serif" font-size="24" fill="white">🚿  Private Bathroom</text>
    <circle cx="900" cy="830" r="18" fill="#e94560"/>

    <text x="160" y="920" font-family="Arial,sans-serif" font-size="24" fill="white">🌿  Has Balcony / Patio</text>
    <circle cx="900" cy="910" r="18" fill="#e94560"/>

    <rect x="80" y="1250" width="920" height="100" rx="20" fill="#e94560"/>
    <text x="540" y="1315" font-family="Arial,sans-serif" font-size="32" font-weight="bold" text-anchor="middle" fill="white">Add Room</text>
  `);
  await sharp(Buffer.from(ss3)).png().toFile(path.join(OUT, 'screenshot-3-addroom.png'));
  console.log('✓ screenshot-3-addroom.png');
}

async function main() {
  await icon();
  await featureGraphic();
  await screenshots();
  console.log('\nAll store assets ready in:', OUT);
}
main().catch(console.error);
