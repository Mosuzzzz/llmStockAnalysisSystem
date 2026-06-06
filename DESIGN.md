---
name: LLM Stock Analysis System
description: AI-powered stock analysis dashboard for retail investors
colors:
  bg-void: "#000000"
  bg-surface: "#0c0c0c"
  bg-panel: "#141414"
  bg-elevated: "#1e1e1e"
  bg-selected: "#262626"
  ink-primary: "#ffffff"
  ink-secondary: "#6b7280"
  ink-muted: "#374151"
  border-subtle: "#1f2937"
  border-strong: "#333333"
  live-green: "#22c55e"
  signal-red: "#ef4444"
  hold-yellow: "#eab308"
  rsi-blue: "#3b82f6"
  sentiment-purple: "#a855f7"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.05em"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.625
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 900
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
spacing:
  xs: "16px"
  sm: "24px"
  md: "32px"
  lg: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.bg-void}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-primary-hover:
    backgroundColor: "#e5e5e5"
    textColor: "{colors.bg-void}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-analyze-done:
    backgroundColor: "#16a34a"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  button-disabled:
    backgroundColor: "rgba(255,255,255,0.1)"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.sm}"
    padding: "10px 24px"
  input-search:
    backgroundColor: "{colors.bg-elevated}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "14px 44px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "16px"
  nav-item-active:
    backgroundColor: "{colors.bg-selected}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    padding: "16px"
  stats-card:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
  period-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "8px"
    padding: "6px 12px"
  period-chip-active:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.bg-void}"
    rounded: "8px"
    padding: "6px 12px"
---

# Design System: LLM Stock Analysis System

## 1. Overview

**Creative North Star: "The Signal Room"**

A quiet, high-stakes space where the market is always present but never loud. The Signal Room holds data at rest until it means something. Every element earns its presence by carrying information. Decoration is a resource cost; it is spent only when the return is clarity.

The visual system is built on an extreme neutral foundation: five layers of near-black from #000000 to #262626, each serving a distinct depth role. Against this field of void, Live Green (#22c55e) is the single voice of confirmation. It appears where the system says "yes": active selections, positive price movement, the button that executes AI analysis. Its rarity is what gives it authority. The full semantic color vocabulary (red for sell/error, yellow for hold, blue for RSI, purple for sentiment) exists only as data-state indicators — never as decoration.

This system explicitly rejects: the generic SaaS dark dashboard with purple gradients and glow orbs; the Robinhood retail aesthetic that simplifies and gamifies; Bloomberg Terminal's information overload; and the crypto/NFT aesthetic with neon, glassmorphism, and speculative energy. The Signal Room is none of these. It is still, precise, and correct. If the interface feels exciting, it has failed.

**Key Characteristics:**
- Five-step neutral depth ramp as the primary spatial system (tonal elevation, no ambient shadows)
- Live Green as the sole confirmation accent — used on no more than 10% of any screen surface
- Weight 900 at display and label scale, weight 500 at body — maximum contrast between data headers and prose
- Flat-by-default: depth is expressed through background color steps, not box-shadows
- State changes at 150–200ms; the tool moves as fast as the data it shows

## 2. Colors: The Void Ramp

A single-axis neutral ramp punctuated by one live accent and a tight semantic vocabulary for trade signals. The palette is readable at a glance: black field, white ink, green for go.

### Primary
- **Live Green** (#22c55e, oklch(73.5% 0.196 142)): The system's sole confirmation color. Active sidebar items, positive price change badge, chart stroke and fill, the analyze button after analysis completes, loading ring, input focus ring. If green appears in any other context — decorative badge, heading, border accent — remove it.

### Secondary
- **Signal Red** (#ef4444, oklch(62.8% 0.257 29)): Negative price change badges, SELL signal text, error state message backgrounds. Never decorative.
- **Hold Yellow** (#eab308, oklch(79.5% 0.184 86)): HOLD signal text only. Never used as a background or structural color.
- **RSI Blue** (#3b82f6, oklch(62.2% 0.194 260)): RSI metric icon and value in the stats row only.
- **Sentiment Purple** (#a855f7, oklch(60.2% 0.259 303)): Market sentiment icon and FinBERT pipeline indicator only.

### Neutral
- **Void** (#000000): Base page background. The absolute floor.
- **Surface** (#0c0c0c): Main content area, chart container background.
- **Panel** (#141414): Sidebar, chart toolbar header.
- **Elevated** (#1e1e1e): Inputs, exchange badge — elements that read above the panel layer.
- **Selected** (#262626): Active sidebar navigation item state.
- **Ink Primary** (#ffffff): All primary text, primary button fill.
- **Ink Secondary** (#6b7280): Metadata text, placeholder labels, timestamp annotations.
- **Ink Muted** (#374151): Faint borders, grid lines, divider hairlines.
- **Border Subtle** (#1f2937): Component borders at rest.
- **Border Strong** (#333333): Sidebar structural boundary, section dividers.

### Named Rules

**The One Voice Rule.** Live Green appears on no more than 10% of any given screen. Before adding a new green element, identify which existing green element it replaces. Its scarcity is the point.

**The Signal-Only Rule.** Red, yellow, blue, and purple are data-state indicators. They appear in signal badges, metric values, and their paired icons. They do not appear in backgrounds, borders, text blocks, or decorative elements.

## 3. Typography

**Body / Display Font:** System sans-serif (`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`)

**Character:** A single family across all roles, differentiated entirely through weight. Weight 900 (black) at display scale carries the ticker symbol and price — the two data points that must register within three seconds of render. Weight 500 (medium) handles explanatory prose; weight 900 reappears at label scale to ensure micro-labels stay legible against dark surfaces.

### Hierarchy

- **Display** (900, 4.5rem/72px, leading 1, tracking −0.05em): Stock ticker symbol (e.g. "AAPL"). Largest element on screen. One instance per view. Never used for anything else at this size.
- **Metric** (900, 3.75rem/60px, leading 1, tracking −0.05em): Current stock price. Always paired with the display ticker. No other content at this size.
- **Headline** (800, 2.25rem/36px, leading 1.15, tracking −0.025em): Section headings within the main content area. One per content column.
- **Title** (900, 1.5rem/24px, leading 1.3, tracking −0.02em): Metric values in stats cards; sub-section headings like "Current News Mood & Momentum Analysis".
- **Body** (500, 1.125rem/18px, leading 1.625): LLM explanation prose. Max line length 65–75ch. The only text role at weight 500 — its lightness signals "read carefully."
- **Label** (900, 0.625rem–0.75rem/10–12px, tracking 0.1em, uppercase): Component labels, badge text, timestamp annotations, period selectors. Four words maximum. No uppercase at any other size or role.

### Named Rules

**The Weight-or-Size Rule.** Hierarchy is expressed through either a size step or a weight step, not both simultaneously. A label that is already the smallest element on screen does not also need a lighter weight. Apply font-black (900) at label scale — it is what makes 10px readable against a near-black surface.

**The Uppercase Ceiling Rule.** Uppercase is reserved for labels (≤4 words), exchange badge ("NASDAQ"), and period selectors ("1D", "1M"). No sentence, heading, body paragraph, or section title uses uppercase. This rule applies retroactively to the overuse of `tracking-widest uppercase` labels currently scattered across every panel.

## 4. Elevation

This system uses tonal elevation: depth is expressed through background color steps, not shadows. Surfaces rest flat. The five neutral steps (Void → Surface → Panel → Elevated → Selected) create a legible spatial hierarchy without blur, glow, or lift.

One exception exists: the chart container applies `box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)` as a container-boundary reinforcement against the Surface behind it. This is functional, not decorative.

### Shadow Vocabulary

- **Container Boundary** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`): Used on the chart container only. Signals that this element is a self-contained unit, not a panel section.
- **Glow Accent** (hover-only, `radial-gradient(circle at top right, rgba(255,255,255,0.05), transparent)`): Stats card hover diffusion. Appears at opacity 0 at rest, opacity 1 on hover. Not a shadow — a surface shimmer.

### Named Rules

**The Flat-by-Default Rule.** Surfaces rest flat. When depth is needed, step down the neutral ramp. Shadows appear only at container boundaries or in direct response to hover state. If a shadow looks decorative, remove it and add a background step instead.

## 5. Components

### Buttons

Confident and flat. Fills are solid; actions are definitive. No gradients, no glow, no animated entrances.

- **Shape:** Gently curved (12px radius, `rounded-xl`)
- **Primary (idle):** White fill (#ffffff), black text (#000000), `padding: 10px 24px`, `font-black uppercase tracking-widest text-sm`. No border. Scale 1.05 on hover, 150ms transition.
- **Primary (loading):** 10% white fill (`rgba(255,255,255,0.1)`), gray-500 text, disabled cursor. Spinner icon replaces the brain icon. Not clickable.
- **Analyze done (re-analyze state):** Green-600 fill (#16a34a), white text, `border: 1px solid rgba(74,222,128,0.3)`, subtle green shadow `0 4px 20px rgba(34,197,94,0.2)`. Indicates the analysis succeeded and can be re-run.
- **Ghost / Secondary:** When needed: `1px solid rgba(255,255,255,0.1)` border, transparent fill, white text. Never a colored border on a ghost button.

### Period Chips (Chart Toolbar)

- **Container:** Panel (#141414) strip, `rounded-xl`, `border border-gray-800`, 6px internal padding.
- **Chip (inactive):** Transparent, gray-500 text, `padding: 6px 12px`, 8px radius, `font-black uppercase tracking-widest text-[10px]`. Hover goes to white text.
- **Chip (active):** White fill (#ffffff), black text (#000000). State change is instant (no transition). One active chip per strip at all times.

### Sidebar Navigation Items

- **Shape:** 12px radius
- **Idle:** Transparent background, invisible border, white symbol text (bold, 1rem), gray-500 company name (10px, medium). Hover: 5% white overlay.
- **Active:** `background: #262626`, `border: 1px solid #1f2937` — tonal lift plus a hairline border. The border is present only on the active state.
- **Delete control:** Hidden at rest (`opacity-0`), visible on group hover (`opacity-100`). Red-500 on its own hover. Always fires `e.stopPropagation()`. Never visible by default.

### Search Input

- **Style:** `background: #1e1e1e`, no border at rest, 12px radius, `padding: 14px 16px 14px 44px` (icon offset). Icon is gray-500 at rest, transitions to white on container focus.
- **Focus:** `box-shadow: 0 0 0 1px rgba(34,197,94,0.5)`. No border shift, no layout reflow.
- **Placeholder:** Ink Secondary (#6b7280). Contrast ratio on #1e1e1e background is approximately 3.8:1 — marginally below WCAG AA (4.5:1). For the next pass, use gray-400 (#9ca3af) for the placeholder to hit compliance.

### Stats Cards

The current implementation is four identical cards with icon + metric + label in a uniform grid — this is the banned identical card grid pattern. The documentation reflects current state. On the next design pass, differentiate the Signal card (primary hierarchy, larger, colored background tint) from the supporting RSI / Volume / Confidence cards.

- **Shape:** 24px radius (`rounded-3xl`)
- **Background:** `rgba(255,255,255,0.05)` over Surface — barely visible tint.
- **Border:** `rgba(255,255,255,0.05)` at rest, `rgba(255,255,255,0.1)` on hover.
- **Internal layout:** Label (10px, font-black, uppercase, gray-400) top-left; metric value (24px, font-black, semantic color) below; icon in right cell with `background: rgba(0,0,0,0.4)` overlay panel, 16px radius.
- **Hover glow:** Radial white diffusion, top-right, `opacity-0` → `opacity-100` on group-hover.

### Chart Container

- **Shape:** 24px radius
- **Background:** Surface (#0c0c0c)
- **Border:** `border: 1px solid #111827` (gray-900 hairline)
- **Container shadow:** `box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`
- **Internal wrap:** 4px container padding, then 24px content padding inside.
- **Chart series:** Live Green stroke (#22c55e), 3px width, smooth curve. Area fill: green-to-transparent gradient (40% → 5% opacity, stops 0/90/100). Grid: #111111 dashed, 4px dash array. Tooltip: dark theme, price formatted as `$X.XX`.

### Insight Panel (AI Analysis)

Two-column layout: explanation prose on the left, sentiment context card on the right.

- **Explanation column:** 4rem headline (font-extrabold), explanation body at 18px / medium weight / gray-400 color. The current `border-left: 3px solid #22c55e` stripe on the explanation block is a banned side-stripe pattern and must be removed on the next pass. Replace with a `background: rgba(34,197,94,0.05)` tint block or remove entirely and let the prose stand alone.
- **Sentiment card:** Surface (#0c0c0c), `border: 1px solid #111827`, 24px radius, 40px padding. Sentiment state badge: `border-radius: 9999px`, green tint background and border, 10px font-black uppercase text.
- **Empty state:** Dashed border container (`border: 2px dashed #111827`), 48px radius. Center-aligned heading and a single action instruction. Loading replaces the text with the spinner + "AI is thinking..." label.

## 6. Do's and Don'ts

### Do:
- **Do** use Live Green (#22c55e) exclusively for the confirm state: active nav, positive price movement, the primary CTA after analysis runs, and the BUY signal badge. One role per color.
- **Do** express depth through the neutral ramp: Void → Surface → Panel → Elevated → Selected. Each step is a distinct spatial layer; do not skip steps.
- **Do** apply font-black (900) at display scale (ticker, price) and label scale (≤12px uppercase tags). Use font-medium (500) for all prose. The contrast between these two weights is the typographic system.
- **Do** make trade signals legible without color: always pair BUY/SELL/HOLD with a text label and a distinct icon. Color is supplementary; do not rely on it as the only signal differentiator.
- **Do** keep all interaction transitions at ≤200ms. This tool works with live market data; it must feel as responsive as the data it displays.
- **Do** write empty states that instruct the user ("Click 'Run AI Analysis' to begin the DeepSeek reasoning process") — not placeholders or "no data" messages.
- **Do** show real data or a defined empty state ("--") in every data field. Hardcoded placeholder values (like "+1.2%" in the watchlist) are a bug, not a design choice.

### Don't:
- **Don't** add purple gradients, gradient text, glow orbs, or decorative glassmorphism. This is not a generic SaaS dark dashboard. If it looks like one, undo it.
- **Don't** use playful, gamified, or simplified retail-app UI patterns. The target user is making real financial decisions.
- **Don't** pile on data density until the primary signal (BUY/SELL/HOLD) cannot be read within three seconds of page render. Density is a tool, not a feature.
- **Don't** use crypto/NFT aesthetics: no neon color, no heavy backdrop-blur panel cards, no speculative palette energy.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored stripe accent on callouts, explanation blocks, or list items. This is a banned pattern across the system. Replace with a background tint, a full border, or remove the accent entirely.
- **Don't** add uppercase tracked eyebrow labels above every section. Maximum three uppercase section labels per screen. Beyond that, it is AI grammar. Reduce on every design pass until only intentional instances remain.
- **Don't** use the identical card grid pattern (same-sized cards with icon + metric + label repeated in a uniform grid) for more than supporting metrics. The primary Signal card should be visually dominant — different in size, weight, or treatment.
- **Don't** commit placeholder data to the UI. Every field the user sees must either show a real value or a defined empty state.
