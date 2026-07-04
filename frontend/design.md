# Monad AI Agent — Frontend Design Document

> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Three.js / React Three Fiber · RainbowKit · wagmi · next-auth · Lenis Smooth Scroll

---

## 1. Design Philosophy

The UI follows a **minimal-premium** aesthetic — inspired by fintech products like Linear, Vercel, and Stripe. Key principles:

- **Monochromatic base** (near-black / near-white) with a single vibrant accent — Monad Purple (`#836EF9`).
- **Motion over decoration** — every state change, scroll, or interaction is animated.
- **Data density without clutter** — dashboard tiles pack a lot of info into clean, bordered cards.
- **Dual theme** — full light / dark mode support via CSS custom properties + `next-themes`.

---

## 2. Color System

Defined as CSS custom properties in `globals.css` and consumed via Tailwind v4 `@theme`:

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--bg` | `#FAFAFA` | `#111111` | Page background |
| `--fg` | `#111111` | `#FAFAFA` | Primary text, headings |
| `--muted` | `#6B7280` | `#9CA3AF` | Secondary text, labels |
| `--border` | `#E5E7EB` | `#374151` | Card/divider borders |
| `--card` | `#FFFFFF` | `#1F2937` | Panel / tile backgrounds |
| `--accent` | `#836EF9` | `#836EF9` | Monad Purple — CTAs, highlights, charts |
| `--success` | `#16A34A` | `#16A34A` | Buy signals, positive PnL |
| `--danger` | `#DC2626` | `#DC2626` | Sell signals, critical alerts, locked state |

### Semantic Extras (not tokenised, used inline)
| Color | Usage |
|---|---|
| `#F59E0B` | Warning / elevated risk |
| `#10B981` | Live/connected status |
| `#1A1A1A` | Code block / terminal surfaces inside dark panels |
| `#333` | Borders inside the dark AI Reasoning panel |

---

## 3. Typography

- **Font:** `Inter` (variable font, loaded via `next/font/google`), applied globally through `--font-sans`.
- **Anti-aliasing:** `-webkit-font-smoothing: antialiased` + `-moz-osx-font-smoothing: grayscale`.
- **Heading tracking:** `letter-spacing: -0.02em` for all `h1–h6` by default.
- **Hero:** `text-6xl md:text-[5.5rem]`, `font-medium`, `tracking-[-0.03em]`, `leading-[1.05]`.
- **Section titles:** `text-4xl md:text-5xl`, `font-medium`, `tracking-tight`.
- **Labels/meta:** `text-xs`, `uppercase`, `tracking-widest`.
- **Monospace numbers/data:** `font-mono` (system mono stack).

---

## 4. Spacing & Layout

- **Max widths:** `max-w-[1400px]` (landing), `max-w-[1600px]` (dashboard), `max-w-[760px]` (FAQ/narrow).
- **Horizontal padding:** `px-8` (standard), `px-4 md:px-8 lg:px-12` (hero, responsive).
- **Grid:** Tailwind CSS Grid. Dashboard uses `grid-cols-12` split into `lg:col-span-8` (main) + `lg:col-span-4` (sidebar).
- **Gap:** `gap-8` between major panels.
- **Border radius:** `rounded-full` (pills/avatars), `rounded-2xl` (inputs/buttons), `rounded-3xl` (cards/overlays), `rounded-[2rem]` (terminal mock).

---

## 5. Animation System

All motion via **Framer Motion**. Patterns used across the app:

| Pattern | Details |
|---|---|
| **Entrance fade-up** | `initial: {opacity:0, y:20-30}` → `animate: {opacity:1, y:0}`, duration 0.7–1s, easing `[0.16,1,0.3,1]` |
| **Staggered children** | `delay: i * 0.08` in feature/step lists |
| **Hover lift** | `whileHover: {y:-4}` on feature cards |
| **Icon spring** | `whileHover: {scale:1.1, rotate:6}`, `type:"spring", stiffness:300` |
| **Accordion expand** | `initial:{height:0,opacity:0}` → `animate:{height:"auto",opacity:1}` + `AnimatePresence` |
| **Scroll-triggered** | `whileInView` + `viewport:{once:true, margin:"-80px"}` |
| **Number counters** | Custom `useCounter` hook — `setInterval` increments over 2 s on `useInView` trigger |
| **Animated numbers** | `AnimatedNumber` component — value animates smoothly on prop change (Portfolio) |
| **Typing effect** | `TypingEffect` component — char-by-char render at 20ms/char (AI Reasoning rationale) |
| **Tech marquee** | `motion.div` `animate:{x:["0%","-50%"]}` infinite linear, 18 s |
| **Theme toggle icon** | `scale + rotate` spring on mount |
| **Workflow step** | Step circle `animate:{backgroundColor}` on `activeStep` index comparison |
| **SVG ring** | `motion.circle` `strokeDashoffset` animated to usage % (KillSwitch gauge) |

**Smooth scrolling:** Lenis (`@studio-freight/lenis`) initialized in `SmoothScrolling.tsx` as a client component, with CSS utilities in `globals.css` for `lenis-smooth` state management.

---

## 6. Pages & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `page.tsx` → `LandingContent` + `Hero` | Marketing landing page |
| `/dashboard` | `DashboardPreview` | Full trading dashboard |
| `/funding` | `FundingPage` | Stripe deposit flow |
| `/withdraw` | *(withdraw page)* | Withdrawal flow |

---

## 7. Component Architecture

### 7.1 Landing Page

#### `Navbar`
- Fixed, `backdrop-blur-xl`, `bg-background/80` — frosted glass effect.
- Slide-in entrance: `y:-20 → 0`, opacity fade.
- Left: Zap logo icon + wordmark.
- Right: `ThemeToggle` · Google Login / User Avatar dropdown · `ConnectButton` (RainbowKit).
- Avatar dropdown: Dashboard, Funding, Settings, Sign Out — slides out as a `rounded-2xl` card.

#### `Hero`
- Full-screen (`min-h-screen`) with a **Three.js Canvas** as absolute background layer.
- **3D Monad Coin** (`MonadCoin`):
  - `CylinderGeometry` body + `CircleGeometry` faces with a canvas-drawn Monad logo texture.
  - Auto-spins on Y axis (1.5 rad/s) + floating bob (`sin` wave).
  - Mouse-tilt via `targetTilt` refs, smoothed with lerp (factor 0.06).
  - Drag-to-spin + flick velocity (`flickVelocity` ref).
  - Breath-scale pulse (`sin` wave ±1.5%).
  - Glow halo mesh behind the coin.
- **Particle Field** (`ParticleField`): `@react-three/drei` `Sparkles` (800 count, Monad purple, drifts slowly, nudges toward mouse).
- **Lighting:** Ambient + 2 directional + 2 point lights (white + purple tones).
- **Text overlay** (left-aligned, `md:w-1/2`):
  - Live badge (pulsing purple dot).
  - `h1`: "Autonomous AI Trading. Built on Monad." — purple accent on last clause.
  - Subtitle paragraph.
  - CTA buttons: `Launch Dashboard` (filled, `rounded-full`) + `View GitHub` (outlined).
- **Hint text:** "drag or click the coin ↗" fades in after 2.5 s on desktop.
- Radial gradient overlay that tracks mouse position (`--mx`, `--my` CSS vars).

#### `LandingContent`

**Stats Bar:**
- 4-column grid of animated counters: `10,000+ TPS`, `99% Uptime`, `400ms Latency`, `100% Non-Custodial`.

**Features Section:**
- 3-column grid of 6 feature cards (icon + title + description).
- On hover: icon tilts/scales (spring), title turns purple, card lifts `y:-4`.
- Icons: Cpu, Brain, Shield, LineChart, Zap, Lock (Lucide).

**AI Workflow (dark section):**
- Inverted background (`bg-foreground text-background`).
- Left: 5-step vertical list, each step auto-activates sequentially when in view. Click to jump to any step.
- Step indicator circles animate `backgroundColor` → Monad Purple when active.
- Right: Faux terminal card (`bg-[#1A1A1A]/80`, `backdrop-blur-xl`, macOS traffic light dots). Lines fade in as steps activate, culminating in `EXECUTE_BUY | 89% CONFIDENCE`.

**Tech Marquee:**
- `MONAD · Pyth · MiniMax · Stripe · Next.js · RainbowKit` scrolling infinitely at linear speed.
- Fade-out edges via gradient overlays.

**FAQ Accordion:**
- 4 questions. `AnimatePresence` + height animation for answers.
- `ChevronDown` rotates 180° when open.
- Active question title turns purple.

#### `Footer`
- Inverted (`bg-foreground text-background`).
- Logo + nav links (Documentation, Monad Ecosystem).
- Copyright notice.

---

### 7.2 Dashboard Page (`DashboardPreview`)

Data-driven by `useDashboardState` hook — polls the backend API and provides a `SharedState` object to all child panels.

**Layout:** `grid-cols-12`
- **Col 1–8 (Main):**
  1. Charts Row (`md:grid-cols-2`, h-450px each)
  2. AI Reasoning Panel (dark, full width)
  3. Oracle Widget
- **Col 9–12 (Sidebar):**
  1. Portfolio Panel
  2. Manual Trading Panel
  3. Kill Switch / Risk Panel

**Header:**
- Title "Intelligence at Work." + subtitle.
- Shows user avatar/name when logged in.
- "Syncing Data" badge (purple pulsing dot) during data load.
- RainbowKit `ConnectButton`.

---

### 7.3 Dashboard Panels

#### `MonadTradingChart`
- Lightweight Charts (`lightweight-charts`) candlestick chart.
- Fetches historical OHLCV from **Pyth Benchmarks API** (`benchmarks.pyth.network`).
- Live polling every 5 s from **Pyth Hermes** (`hermes-beta.pyth.network`) — updates last candle in real time.
- Symbol toggle: `MON/USD` / `ETH/USD`.
- Time range: `LIVE` (1-min candles, 1-day window) · `1M` (daily, 30-day) · `2M` (daily, 60-day).
- Crosshair: Monad Purple (`#836EF9`) label background.
- Loading spinner overlaid with `backdrop-blur-sm`.
- Chart colors: green `#16A34A` up candles, red `#DC2626` down candles.

#### `TradingChart`
- Similar candlestick chart, but consumes `SharedState` data from the backend AI agent.

#### `AIReasoning`
- Dark panel (`bg-foreground`) — always dark regardless of theme.
- Shows current AI recommendation: **BUY** (green) / **SELL** (red) / **HOLD** (purple), animated scale-in on change.
- Confidence %, Risk level (color-coded: green/amber/red), Market trend, Position size, Target, Timestamp.
- **"View MiniMax Rationale"** expandable accordion with `TypingEffect` rendering the AI's raw reasoning text.
- Status badge: "MiniMax Thinking" / "MiniMax Idle" with pulsing green dot.

#### `KillSwitch`
- Displays daily trading limit compliance.
- **SVG circular gauge** — animated `strokeDashoffset` (Monad Purple normally, Amber at >80%, Red if locked).
- Shows: Remaining Capacity / Daily Cap / Cooldown / Health status.
- **"Manual Override (Pause)"** / **"Authorize System Reset"** button — calls `pause()` / `unpause()` on the KillSwitch smart contract via `wagmi` `useWriteContract`.
- Button disabled if wallet not connected or tx pending.

#### `Portfolio`
- Total balance with `AnimatedNumber` (smooth count-up on value change).
- PnL badge: green pill (positive) / red pill (negative) with arrow icons.
- Asset list: MONAD + USDC rows with amounts and change %.
- Avatar-style token icons.

#### `ManualTrading`
- **Tab switcher:** Manual Trade / Autonomous Mode.
- **Manual Mode:**
  - Buy / Sell toggle (segmented control).
  - Amount input (`font-mono`, large) with 25/50/75/MAX quick-fill buttons.
  - Live MON price from Pyth Hermes (5 s polling).
  - Estimated received calculation with slippage.
  - "Review Buy/Sell" → modal confirmation overlay (`backdrop-blur-md`) → calls `executeTrade` on KillSwitch contract.
  - Success/error states handled via wagmi hooks.
- **Autonomous Mode:**
  - Big icon state card (Play/Pause icon, purple glow when active).
  - Enable/Disable toggle button.
  - "Next Evaluation" countdown + "AI Health: Optimal" status.

#### `OracleWidget`
- Status grid: Connected / ~400ms latency / Last updated time / Active feeds (MON, USDC).
- Oracle contract address (truncated with ellipsis).
- Live green pulsing dot.

---

### 7.4 Funding Page (`/funding`)

- Sticky header: back arrow, "Deposit Funds" title, Stripe badge, link to Withdrawals.
- **Left column (form):**
  - Large `$` amount input (`font-mono`, `text-4xl`).
  - Quick-select buttons: `$100 / $500 / $1000 / $5000`.
  - Payment method selector (Credit/Debit card, outlined with purple border).
  - Submit button: "Deposit $X".
  - **Success state:** green check icon + confirmation message + return button (fade-scale entrance).
- **Right column (info sidebar):**
  - Sticky card with 3 numbered steps: Instant Availability / Zero Platform Fees / Secure Storage.
  - AML disclaimer alert box.

---

## 8. Auth & Wallet

- **NextAuth** with Google provider (`useSession`, `signIn`, `signOut`).
- **RainbowKit** + **wagmi** for Web3 wallet connection (MetaMask, WalletConnect, etc.).
- `Providers.tsx` wraps the app with `SessionProvider`, `WagmiProvider`, `QueryClientProvider`, `RainbowKitProvider`, and `ThemeProvider` (next-themes).

---

## 9. Theme System

- **next-themes** `ThemeProvider` with `attribute="class"` (applies `.dark` class to `<html>`).
- CSS custom properties swap automatically on class change.
- `ThemeToggle` component: animated Sun ↔ Moon icon with scale + rotate spring.
- Mounted guard (`useState(mounted)`) prevents hydration mismatch.

---

## 10. Key Libraries

| Library | Version (approx) | Purpose |
|---|---|---|
| `next` | 14+ | App Router, SSR/SSG |
| `framer-motion` | 11+ | All animations |
| `@react-three/fiber` | 8+ | 3D canvas (Hero coin) |
| `@react-three/drei` | 9+ | Sparkles, helpers |
| `three` | 0.165+ | 3D geometry & materials |
| `lightweight-charts` | 4+ | Candlestick charts |
| `@rainbow-me/rainbowkit` | 2+ | Wallet connect UI |
| `wagmi` | 2+ | EVM contract interactions |
| `viem` | 2+ | ABI encoding / parseEther |
| `next-auth` | 4+ | Google OAuth session |
| `next-themes` | 0.3+ | Dark/light mode |
| `@studio-freight/lenis` | 1+ | Smooth scroll |
| `lucide-react` | latest | Icon system |

---

## 11. Smart Contract Interactions

Two contracts on **Monad Testnet**:

| Contract | Function | Component |
|---|---|---|
| **KillSwitch** | `pause()` / `unpause()` | `KillSwitch.tsx` |
| **KillSwitch** | `executeTrade(action, size, target, data)` | `ManualTrading.tsx` |

Contract addresses are sourced from `SharedState.contracts` (populated by the backend agent API). Fallback hardcoded addresses are used if the API hasn't responded yet.

---

## 12. Data Flow

```
Backend Agent API (FastAPI / Python)
        │
        ▼
useDashboardState (custom hook — SWR-style polling)
        │
        ├── SharedState.portfolio  →  Portfolio
        ├── SharedState.decision   →  AIReasoning
        ├── SharedState.kill_switch → KillSwitch
        ├── SharedState.contracts  →  ManualTrading + KillSwitch
        └── SharedState.computed   →  AIReasoning (avgConfidence, riskLevel, marketTrend)

Pyth Hermes API (external, polled every 5s)
        │
        ├──  MonadTradingChart (live candle updates)
        └──  ManualTrading (live MON price display)

Pyth Benchmarks API (external, on-demand)
        └──  MonadTradingChart (historical OHLCV)
```

---

## 13. File Map

```
frontend/src/
├── app/
│   ├── globals.css          ← Design tokens, Tailwind theme, Lenis, scrollbar utilities
│   ├── layout.tsx           ← Root layout — Providers + Navbar + SmoothScrolling
│   ├── page.tsx             ← Landing page (Hero + LandingContent + Footer)
│   ├── dashboard/
│   │   └── page.tsx         ← /dashboard → DashboardPreview
│   ├── funding/
│   │   └── page.tsx         ← /funding → FundingPage
│   └── withdraw/
│       └── page.tsx         ← /withdraw
│
├── components/
│   ├── Navbar.tsx           ← Fixed top nav with auth + wallet
│   ├── Hero.tsx             ← Full-screen 3D hero with Monad coin
│   ├── LandingContent.tsx   ← Stats, features, workflow, marquee, FAQ
│   ├── DashboardPreview.tsx ← Dashboard grid layout + data wiring
│   ├── Footer.tsx           ← Inverted footer
│   ├── Providers.tsx        ← All context providers
│   ├── SmoothScrolling.tsx  ← Lenis init
│   ├── ThemeToggle.tsx      ← Sun/Moon animated toggle
│   ├── ArchitectureSection.tsx
│   └── dashboard/
│       ├── MonadTradingChart.tsx  ← Pyth live candlestick chart
│       ├── TradingChart.tsx       ← Agent-data candlestick chart
│       ├── AIReasoning.tsx        ← Dark AI decision panel
│       ├── KillSwitch.tsx         ← Risk gauge + contract toggle
│       ├── Portfolio.tsx          ← Balance + asset list
│       ├── ManualTrading.tsx      ← Trade form + autonomous mode
│       ├── FundingPanel.tsx       ← Funding sub-panel
│       └── OracleWidget.tsx       ← Pyth oracle status
│
├── hooks/
│   └── useDashboardState.ts  ← Polling hook + SharedState type
│
├── lib/                      ← Utilities
└── models/                   ← TypeScript types
```
