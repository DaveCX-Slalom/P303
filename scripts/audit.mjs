// Browser audit: drives every route in real Chrome, collects console errors, runs axe (WCAG 2 A/AA),
// checks touch targets and horizontal overflow, and optionally saves screenshots.
//
//   npm run build && node scripts/audit.mjs [--shots]
//
// Uses the system Chrome via playwright-core (no browser download). Set CHROME_PATH to override.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4173
const BASE = `http://localhost:${PORT}`
const SHOTS = process.argv.includes('--shots')
const OUT = 'docs/screenshots'

const routes = [
  ['pocket', '/'],
  ['offers', '/offers'],
  ['list', '/list'],
  ['stores', '/stores'],
  ['history', '/history'],
  ['rewards', '/rewards'],
  ['inbox', '/inbox'],
  ['settings', '/settings'],
  ['checkout', '/checkout'],
  ['welcome', '/welcome']
]

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
const stop = () => server.kill()
process.on('exit', stop)

for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(BASE)).ok) break
  } catch {
    await new Promise((r) => setTimeout(r, 250))
  }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
if (SHOTS) mkdirSync(OUT, { recursive: true })

const problems = []
const note = (msg) => problems.push(msg)

async function run(scheme, width) {
  const ctx = await browser.newContext({
    viewport: { width, height: 812 },
    deviceScaleFactor: 2,
    isMobile: width < 600,
    hasTouch: width < 600,
    colorScheme: scheme,
    serviceWorkers: 'block'
  })
  await ctx.addInitScript(() => {
    try {
      if (!location.pathname.startsWith('/welcome')) localStorage.setItem('fm-onboarded', '1')
    } catch {}
  })
  const tag = `${scheme}@${width}`

  for (const [name, path] of routes) {
    const page = await ctx.newPage()
    page.on('console', (m) => m.type() === 'error' && note(`[${tag}] ${name}: console error: ${m.text()}`))
    page.on('pageerror', (e) => note(`[${tag}] ${name}: page error: ${e.message}`))
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1600) // mock API latency + count-up

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    if (overflow > 1) note(`[${tag}] ${name}: horizontal overflow of ${overflow}px`)

    // Interactive elements smaller than 44px (WCAG target size) in either dimension; 48px is the project goal.
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select')]
        .filter((el) => el.offsetParent !== null || getComputedStyle(el).position === 'fixed')
        .map((el) => ({ el, r: (el.tagName === 'INPUT' && el.closest('label') ? el.closest('label') : el).getBoundingClientRect() }))
        .filter(({ el, r }) => r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44) && !el.closest('.sr-only') && !el.classList.contains('skip'))
        .map(({ el, r }) => `${el.tagName.toLowerCase()}.${el.className.toString().slice(0, 30)} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`)
    )
    for (const s of small) note(`[${tag}] ${name}: small target ${s}`)

    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
    for (const v of axe.violations) {
      note(`[${tag}] ${name}: axe ${v.id} (${v.impact}): ${v.help} → ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`)
    }

    if (SHOTS && scheme === 'light' && width === 375) await page.screenshot({ path: `${OUT}/${name}.png` })
    if (SHOTS && scheme === 'dark' && width === 375 && ['pocket', 'offers'].includes(name)) await page.screenshot({ path: `${OUT}/${name}-dark.png` })
    await page.close()
  }
  await ctx.close()
}

await run('light', 375)
await run('dark', 375)
await run('light', 320)
await run('light', 768)

await browser.close()
stop()

if (problems.length) {
  console.log(`${problems.length} finding(s):\n` + problems.map((p) => ' - ' + p).join('\n'))
  process.exitCode = 1
} else {
  console.log('Audit clean: no console errors, no overflow, no axe violations, all targets >= 44px.')
}
