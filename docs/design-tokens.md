# Design tokens

Source of truth: `src/assets/tokens.css`. Never hardcode colors in components.

| Token | Value | Use |
|-------|-------|-----|
| `--color-bg` | #fbf6ea | Warm cream background |
| `--color-primary` | #1f5f3a | Deep green: actions, points |
| `--color-accent` | #c23a22 | Deals and expiry urgency only |
| `--color-ink` / `--color-ink-muted` | #1b2a21 / #4a5a50 | Text |
| `--color-bright-bg` / `--color-bright-ink` | #fff / #000 | Brightness mode code card |
| `--touch` | 48px | Minimum touch target |
| `--tabbar-h` | 64px | Bottom tab bar |
| `--column` | 480px | Phone-width column, centered on tablets |

Type: rounded system sans (`ui-rounded`, Nunito, Segoe UI). Base 1rem so text scales to 200%. Points use `--text-numeral` (3.25rem).
