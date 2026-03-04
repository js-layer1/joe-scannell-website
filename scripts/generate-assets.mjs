import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.join(__dirname, '..', 'app')

// Colors
const BG = { r: 250, g: 248, b: 245, alpha: 1 }
const TEXT = '#2C2825'
const MUTED = '#6B6560'

// --- Favicon 32x32 ---
// SVG with "JS" monogram on warm background
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <rect width="32" height="32" fill="#FAF8F5" rx="4"/>
  <text x="16" y="22" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="bold"
    fill="#2C2825" text-anchor="middle">JS</text>
</svg>`

await sharp(Buffer.from(faviconSvg))
  .resize(32, 32)
  .png()
  .toFile(path.join(appDir, 'favicon.ico'))

console.log('favicon.ico created (32x32 PNG in ICO path)')

// --- Apple Touch Icon 180x180 ---
const appleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <rect width="180" height="180" fill="#FAF8F5" rx="20"/>
  <text x="90" y="124" font-family="Helvetica, Arial, sans-serif" font-size="72" font-weight="bold"
    fill="#2C2825" text-anchor="middle">JS</text>
</svg>`

await sharp(Buffer.from(appleSvg))
  .resize(180, 180)
  .png()
  .toFile(path.join(appDir, 'apple-icon.png'))

console.log('apple-icon.png created (180x180)')

// --- OG Image 1200x630 ---
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FAF8F5"/>
  <!-- Subtle warm border line at top -->
  <rect y="0" width="1200" height="6" fill="#B8956A" opacity="0.4"/>
  <!-- Main name -->
  <text x="600" y="285" font-family="Helvetica, Arial, sans-serif" font-size="80" font-weight="bold"
    fill="#2C2825" text-anchor="middle">Joe Scannell</text>
  <!-- Tagline -->
  <text x="600" y="365" font-family="Helvetica, Arial, sans-serif" font-size="38"
    fill="#6B6560" text-anchor="middle">Founder, Layer One Group</text>
</svg>`

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png()
  .toFile(path.join(appDir, 'opengraph-image.png'))

console.log('opengraph-image.png created (1200x630)')
console.log('All assets generated successfully.')
