// Renders the Fieldmarket logo mark to PWA icons with real Chrome (no image libraries needed).
//   node scripts/make-icons.mjs
import { writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const mark = (inset) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%">
  <rect width="48" height="48" fill="#1f5f3a"/>
  <g transform="translate(24 24) scale(${inset}) translate(-24 -24)">
    <path d="M12 20h24l-2.4 14a3 3 0 0 1-3 2.5H17.4a3 3 0 0 1-3-2.5z" fill="#fbf6ea"/>
    <path d="M17 20v-3a7 7 0 0 1 14 0v3" fill="none" stroke="#fbf6ea" stroke-width="3" stroke-linecap="round"/>
    <path d="M24 31c-3.5-1-4.5-4-4-6 3 0 5.5 1.5 4 6zm0 0c3.5-1 4.5-4 4-6-3 0-5.5 1.5-4 6z" fill="#c23a22"/>
  </g>
</svg>`

// "any" icons fill the canvas; the maskable one keeps the mark inside the 80% safe zone.
const targets = [
  ['public/icon-192.png', 192, 1.25],
  ['public/icon-512.png', 512, 1.25],
  ['public/icon-maskable-512.png', 512, 0.95]
]

const browser = await chromium.launch({ executablePath: CHROME })
for (const [path, size, inset] of targets) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(`<body style="margin:0;background:#1f5f3a">${mark(inset)}</body>`)
  writeFileSync(path, await page.screenshot({ type: 'png' }))
  await page.close()
  console.log('wrote', path)
}
await browser.close()

writeFileSync('public/icon.svg', mark(1.25).replace('width="100%" height="100%"', 'width="512" height="512"').trim() + '\n')
console.log('wrote public/icon.svg')
