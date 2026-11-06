// Records docs/demo.gif (the main flow) and a few extra stills for the README, using real Chrome.
//   npm run build && node scripts/make-demo.mjs
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { chromium } from 'playwright-core'
import { PNG } from 'pngjs'
import gifenc from 'gifenc'

const { GIFEncoder, applyPalette, quantize } = gifenc

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4176
const BASE = `http://localhost:${PORT}`
mkdirSync('docs/screenshots', { recursive: true })

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(BASE)).ok) break
  } catch {
    await new Promise((r) => setTimeout(r, 250))
  }
}

const browser = await chromium.launch({ executablePath: CHROME })

// One walk through the app. `shoot(delayMs, stillName?)` is called at each moment worth showing.
async function walk(page, shoot) {
  await page.goto(BASE + '/')
  await page.getByRole('img', { name: /QR code for member/ }).waitFor()
  await page.getByText('Best for you right now').waitFor()
  await page.waitForTimeout(1100)
  await shoot(1500)

  await page.getByRole('button', { name: 'Clip this offer' }).click()
  await page.waitForTimeout(300)
  await shoot(900)

  await page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'Offers' }).click()
  await page.locator('li.offer').first().waitFor()
  await page.getByRole('button', { name: /^Clipped \(1\)/ }).waitFor()
  await shoot(1100)

  await page.getByRole('searchbox').fill('berries')
  await page.waitForTimeout(250)
  await shoot(1300)
  await page.getByRole('searchbox').fill('')

  await page.locator('.offer__open').first().click()
  await page.getByRole('dialog').waitFor()
  await page.waitForTimeout(450)
  await shoot(1600, 'offer-sheet')
  await page.keyboard.press('Escape')

  await page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'Stores' }).click()
  await page.getByRole('img', { name: /Store map/ }).waitFor()
  await page.waitForTimeout(300)
  await shoot(1600, 'stores-clipped')

  await page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'History' }).click()
  await page.getByRole('img', { name: /Points by month/ }).waitFor()
  await page.waitForTimeout(300)
  await shoot(1500)

  await page.getByRole('button', { name: 'Redeem points' }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Free coffee/ }).click()
  await page.waitForTimeout(350)
  await shoot(1300, 'redeem')
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.getByText(/Free coffee redeemed/).waitFor()
  await page.waitForTimeout(450)
  await shoot(1300)
  await page.keyboard.press('Escape')

  await page.locator('nav[aria-label="Main"]').getByRole('link', { name: 'Pocket' }).click()
  await page.getByRole('link', { name: 'Checkout mode' }).click()
  await page.getByText('Scan at the register').waitFor()
  await page.waitForTimeout(500)
  await shoot(1800)
}

async function context(dpr) {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: dpr, serviceWorkers: 'block', hasTouch: true })
  await ctx.addInitScript(() => localStorage.setItem('fm-onboarded', '1'))
  return ctx
}

// Pass 1: 1x frames for the GIF.
{
  const ctx = await context(1)
  const page = await ctx.newPage()
  const gif = GIFEncoder()
  let n = 0
  await walk(page, async (delay) => {
    const png = PNG.sync.read(await page.screenshot({ type: 'png' }))
    const rgba = new Uint8Array(png.data)
    const palette = quantize(rgba, 256)
    gif.writeFrame(applyPalette(rgba, palette), png.width, png.height, { palette, delay })
    n++
  })
  gif.finish()
  writeFileSync('docs/demo.gif', gif.bytes())
  console.log(`docs/demo.gif: ${n} frames, ${(gif.bytes().length / 1024).toFixed(0)} KB`)
  await ctx.close()
}

// Pass 2: 2x stills for the README.
{
  const ctx = await context(2)
  const page = await ctx.newPage()
  await walk(page, async (_delay, still) => {
    if (still) {
      await page.screenshot({ path: `docs/screenshots/${still}.png` })
      console.log(`docs/screenshots/${still}.png`)
    }
  })
  await ctx.close()
}

await browser.close()
server.kill()
