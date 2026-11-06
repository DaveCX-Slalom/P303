import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

// WCAG 2 contrast for the design tokens, in both themes. AA for text is 4.5:1.
const css = readFileSync(resolve(process.cwd(), 'src/assets/tokens.css'), 'utf8')

function block(selectorStart) {
  const i = css.indexOf(selectorStart)
  const body = css.slice(css.indexOf('{', i) + 1, css.indexOf('}', i))
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]))
}
const light = block(':root {')
const dark = { ...light, ...block(":root[data-theme='dark']") }

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const pairs = [
  ['color-ink', 'color-bg'],
  ['color-ink', 'color-surface'],
  ['color-ink-muted', 'color-bg'],
  ['color-ink-muted', 'color-surface'],
  ['color-ink-muted', 'color-surface-alt'],
  ['color-primary', 'color-bg'],
  ['color-primary', 'color-surface'],
  ['color-primary-ink', 'color-primary'],
  ['color-accent', 'color-bg'],
  ['color-accent', 'color-surface'],
  ['color-accent-ink', 'color-accent'],
  ['color-bright-ink', 'color-bright-bg']
]

for (const [name, theme] of [['light', light], ['dark', dark]]) {
  describe(`${name} theme text contrast (AA 4.5:1)`, () => {
    for (const [fg, bg] of pairs) {
      it(`${fg} on ${bg}`, () => expect(ratio(theme[fg], theme[bg])).toBeGreaterThanOrEqual(4.5))
    }
  })
}
