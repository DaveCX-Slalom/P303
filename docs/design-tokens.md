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

## Dark theme

Dark values are defined in the same file, applied by the system setting or forced with `data-theme` on `<html>` (Settings → Appearance). Both themes are tested for AA text contrast (`tests/contrast.test.js`).

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg` | #fbf6ea | #101a14 |
| `--color-surface` | #ffffff | #18261d |
| `--color-ink` / `--color-ink-muted` | #1b2a21 / #4a5a50 | #f1ecdc / #b9c6bc |
| `--color-primary` / `--color-primary-ink` | #1f5f3a / #fff | #62c18a / #08170e |
| `--color-accent` / `--color-accent-ink` | #c23a22 / #fff | #ff8a6e / #2a0d06 |

The member code card and Checkout mode stay white-on-black in both themes so scanners read them reliably.
