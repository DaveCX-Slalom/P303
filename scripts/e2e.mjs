// End-to-end checks in real Chrome. Exercises the flows a member actually uses.
//
//   npm run build && node scripts/e2e.mjs
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 4174
const BASE = `http://localhost:${PORT}`

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
process.on('exit', () => server.kill())
for (let i = 0; i < 40; i++) {
  try {
    if ((await fetch(BASE)).ok) break
  } catch {
    await new Promise((r) => setTimeout(r, 250))
  }
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true })
let page
let passed = 0
const failed = []

async function test(name, fn) {
  try {
    await fn()
    passed++
    console.log('  ok  ', name)
  } catch (e) {
    failed.push(name)
    console.log('  FAIL', name, '\n       ', String(e.message).split('\n')[0])
    await page?.keyboard?.press('Escape').catch(() => {}) // don't let an open sheet cascade into later tests
  }
}
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg)
}

async function newPage({ intro = false, scheme = 'light', width = 375 } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height: 812 }, colorScheme: scheme, serviceWorkers: 'block', hasTouch: true })
  if (!intro) await ctx.addInitScript(() => localStorage.setItem('fm-onboarded', '1'))
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && !/ERR_INTERNET_DISCONNECTED/.test(m.text()) && errors.push(m.text()))
  page.errors = errors
  return page
}
const tab = (page, name) => page.locator('nav[aria-label="Main"]').getByRole('link', { name }).click()
const axeFor = async (page, label) => {
  await page.waitForTimeout(450) // let sheet animations settle so contrast is measured on final colors
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  expect(!r.violations.length, `${label}: ${r.violations.map((v) => v.id + ' ' + v.nodes[0].target.join(' ')).join('; ')}`)
}

console.log('First run')
await test('first visit goes through the intro, then lands on Pocket', async () => {
  const page = await newPage({ intro: true })
  await page.goto(BASE + '/')
  await page.waitForURL('**/welcome')
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Next' }).click()
  await page.getByRole('button', { name: 'Get started' }).click()
  await page.waitForURL(BASE + '/')
  await page.getByText('Hi, Priya').waitFor()
  await page.reload()
  await page.getByText('Hi, Priya').waitFor() // not shown again
  await page.context().close()
})

console.log('Core flows')
page = await newPage()
await page.goto(BASE + '/')

await test('Pocket shows code, points, best offer; no console errors', async () => {
  await page.getByText('Hi, Priya').waitFor()
  await page.getByRole('img', { name: /QR code for member FM-4829/ }).waitFor()
  await page.getByText('Best for you right now').waitFor()
  await page.waitForTimeout(1000)
  expect(await page.getByText('2,840', { exact: true }).isVisible(), 'points count-up should settle on 2,840')
})

await test('clipping from Pocket updates the Offers tab count', async () => {
  await page.getByRole('button', { name: 'Clip this offer' }).click()
  await tab(page, 'Offers')
  await page.getByRole('button', { name: /^Clipped \(1\)/ }).waitFor()
})

await test('search narrows offers, and a miss shows a clearable empty state', async () => {
  const search = page.getByRole('searchbox')
  await search.fill('yogurt')
  expect(await page.locator('li.offer').count() === 1, 'one yogurt offer expected')
  await search.fill('zzzz')
  await page.getByText('No offers match').waitFor()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  expect((await page.locator('li.offer').count()) > 5, 'filters should clear')
})

await test('section chip and Ending soon filter', async () => {
  await page.getByRole('group', { name: 'Filter by section' }).getByRole('button', { name: 'Dairy' }).click()
  expect(await page.locator('li.offer').count() === 2, 'two Dairy offers expected')
  await page.getByRole('button', { name: 'All sections' }).click()
  await page.getByRole('button', { name: 'Ending soon' }).click()
  const n = await page.locator('li.offer').count()
  expect(n >= 1 && n <= 4, `ending-soon should be a small subset, got ${n}`)
  await page.getByRole('button', { name: 'Ending soon' }).click()
})

await test('sort changes the order', async () => {
  const titles = async () => (await page.locator('li.offer h3').allTextContents()).map((t) => t.trim())
  await page.getByLabel('Sort').selectOption('az')
  const az = await titles()
  expect(JSON.stringify(az) === JSON.stringify([...az].sort((a, b) => a.localeCompare(b))), `A to Z not alphabetical: ${az.slice(0, 4)}`)
  await page.getByLabel('Sort').selectOption('ending')
  await page.getByLabel('Sort').selectOption('best')
})

await test('offer details sheet traps focus, closes on Esc, restores focus', async () => {
  const opener = page.locator('.offer__open').first()
  await opener.click()
  const dialog = page.getByRole('dialog')
  await dialog.waitFor()
  expect(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), 'focus should move into the sheet')
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
  expect(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), 'Tab must stay inside the sheet')
  await axeFor(page, 'offer sheet')
  await page.keyboard.press('Escape')
  await dialog.waitFor({ state: 'detached' })
  expect(await page.evaluate(() => document.activeElement.classList.contains('offer__open')), 'focus should return to the opener')
})

await test('Add to list from the sheet lands on the shopping list', async () => {
  await page.locator('.offer__open').first().click()
  await page.getByRole('button', { name: 'Add to list' }).click()
  await page.getByRole('button', { name: 'On your list ✓' }).waitFor()
  await page.keyboard.press('Escape')
  await page.getByRole('link', { name: /My list/ }).click()
  await page.getByRole('heading', { name: 'Shopping list' }).waitFor()
  expect(await page.locator('.item').count() === 1, 'one item expected')
})

await test('shopping list sorts into store sections, checks off, clears', async () => {
  await page.locator('#new-item').fill('oat milk')
  await page.locator('#new-item').press('Enter')
  await page.locator('.group', { has: page.getByRole('heading', { name: 'Dairy' }) }).getByText('oat milk').waitFor()
  await page.locator('.item', { hasText: 'oat milk' }).getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Clear checked' }).click()
  expect(await page.locator('.item', { hasText: 'oat milk' }).count() === 0, 'checked item should clear')
})

await test('Stores map lights up the section of a clipped offer', async () => {
  await tab(page, 'Stores')
  const map = page.getByRole('img', { name: /Store map/ })
  await map.waitFor()
  const label = await map.getAttribute('aria-label')
  expect(/Clipped offers in:/.test(label), `map label: ${label}`)
})

await test('History: chart, filter, detail sheet', async () => {
  await tab(page, 'History')
  await page.getByRole('img', { name: /Points by month/ }).waitFor()
  await page.getByRole('button', { name: 'Redeemed', exact: true }).click()
  const pts = await page.locator('.row__pts').allTextContents()
  expect(pts.length > 0 && pts.every((p) => p.trim().startsWith('-')), `only redemptions expected: ${pts}`)
  await page.locator('.row').first().click()
  await page.getByText('Reference').waitFor()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'All', exact: true }).click()
})

await test('redeeming spends points, confirms, and celebrates', async () => {
  await page.getByRole('button', { name: 'Redeem points' }).click()
  await page.getByRole('dialog').getByRole('button', { name: /Free coffee/ }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.getByText(/Free coffee redeemed/).waitFor()
  expect((await page.locator('.confetti').count()) === 1, 'confetti burst expected')
  await page.keyboard.press('Escape')
  await page.getByText('2,540', { exact: false }).first().waitFor()
})

await test('Esc still closes the sheet after Confirm disables the focused button', async () => {
  await page.getByRole('button', { name: 'Redeem points' }).click()
  await page.getByRole('dialog').getByRole('button', { name: /\$5 off coupon/ }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.getByText(/\$5 off coupon redeemed/).waitFor()
  await page.keyboard.press('Escape')
  await page.getByRole('dialog').waitFor({ state: 'detached', timeout: 2000 })
})

await test('Rewards: locked tier reward cannot be redeemed', async () => {
  await page.getByRole('link', { name: 'Rewards' }).first().click()
  await page.getByRole('heading', { name: 'Tier perks' }).waitFor()
  const locked = page.locator('li.reward', { hasText: 'Orchard-only' }).getByRole('button')
  expect(await locked.isDisabled(), 'Orchard reward should be disabled for a Harvest member')
  await page.getByText('Orchard members only').waitFor()
})

await test('Inbox shows expiry alerts and marks them read', async () => {
  await tab(page, 'Pocket')
  await page.getByRole('link', { name: /^Inbox/ }).click()
  await page.getByRole('heading', { name: 'Inbox' }).waitFor()
  expect((await page.locator('.note').count()) >= 2, 'expiring offers should produce alerts')
  await page.getByRole('button', { name: 'Mark all read' }).click()
  expect(await page.getByRole('button', { name: 'Mark all read' }).isDisabled(), 'nothing left unread')
})

await test('Checkout mode is full screen, shows clipped offers, and Done returns', async () => {
  await page.goto(BASE + '/')
  await page.getByRole('link', { name: 'Checkout mode' }).click()
  await page.waitForURL('**/checkout')
  await page.getByText('Scan at the register').waitFor()
  expect(await page.locator('nav[aria-label="Main"]').count() === 0, 'tab bar hidden in checkout mode')
  await page.getByText(/clipped offers? ready/).waitFor()
  await axeFor(page, 'checkout')
  await page.getByRole('link', { name: 'Done' }).click()
  await page.waitForURL(BASE + '/')
})

console.log('Offline')
await test('offline: banner shows, code stays, clips queue, then sync on reconnect', async () => {
  await page.goto(BASE + '/offers')
  await page.locator('li.offer').first().waitFor()
  await page.context().setOffline(true)
  await page.getByRole('status').filter({ hasText: "You're offline" }).waitFor()
  await page.locator('li.offer').first().getByRole('button', { name: /^Clip/ }).click()
  await page.waitForTimeout(300)
  const queued = await page.evaluate(() => JSON.parse(localStorage.getItem('fm-queue') || '[]').length)
  expect(queued === 1, `expected 1 queued clip, got ${queued}`)
  await tab(page, 'Pocket')
  await page.getByRole('img', { name: /QR code for member/ }).waitFor() // code still there
  await page.context().setOffline(false)
  await page.waitForTimeout(2000)
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('fm-queue') || '[]').length)
  expect(after === 0, `queue should flush on reconnect, still ${after}`)
})

console.log('States')
await test('error state offers retry; empty states explain themselves', async () => {
  const p = await newPage()
  await p.goto(BASE + '/offers?mock=error-offers')
  await p.getByText("Can't load this right now").waitFor({ timeout: 5000 }).catch(() => { throw new Error('error-offers: no error state') })
  await p.getByRole('button', { name: 'Try again' }).waitFor()
  await p.goto(BASE + '/history?mock=empty-history')
  await p.getByText('No history yet').waitFor({ timeout: 5000 }).catch(() => { throw new Error('empty-history: no empty state') })
  await p.goto(BASE + '/offers?mock=empty-offers')
  await p.getByText('No offers in this store').waitFor({ timeout: 5000 }).catch(() => { throw new Error('empty-offers: no empty state') })
  await p.evaluate(() => localStorage.removeItem('fm-member')) // no cached code, so the error state is shown
  await p.goto(BASE + '/?mock=error-member')
  await p.getByText("Can't load this right now").waitFor({ timeout: 5000 }).catch(() => { throw new Error('error-member: no error state') })
  await p.context().close()
})

console.log('Theme')
await test('dark theme applies, persists, and passes axe', async () => {
  const p = await newPage()
  await p.goto(BASE + '/settings')
  await p.getByRole('button', { name: 'Dark', exact: true }).click()
  expect((await p.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'data-theme=dark')
  await p.reload()
  await p.getByRole('heading', { name: 'Settings' }).waitFor()
  expect((await p.evaluate(() => document.documentElement.dataset.theme)) === 'dark', 'theme should persist')
  await p.goto(BASE + '/history')
  await p.getByRole('button', { name: 'Redeem points' }).click()
  await p.getByRole('dialog').waitFor()
  await axeFor(p, 'redeem sheet (dark)')
  await p.context().close()
})

await test('reduced motion: no confetti, count-up settles instantly', async () => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', serviceWorkers: 'block' })
  await ctx.addInitScript(() => localStorage.setItem('fm-onboarded', '1'))
  const p = await ctx.newPage()
  await p.goto(BASE + '/')
  await p.getByText('2,840', { exact: true }).waitFor({ timeout: 1500 })
  await p.goto(BASE + '/history')
  await p.getByRole('button', { name: 'Redeem points' }).click()
  await p.getByRole('dialog').getByRole('button', { name: /Free coffee/ }).click()
  await p.getByRole('button', { name: 'Confirm' }).click()
  await p.getByText(/Free coffee redeemed/).waitFor()
  expect((await p.locator('.confetti').count()) === 0, 'no confetti with reduced motion')
  await ctx.close()
})

await test('no console or page errors across the whole session', async () => {
  expect(page.errors.length === 0, page.errors.join(' | '))
})

await browser.close()
server.kill()
console.log(`\n${passed} passed, ${failed.length} failed`)
if (failed.length) process.exitCode = 1
