# BunnyGPT Design System

Source reference: the rendered public experience at `https://www.bunnyhood.xyz/`, inspected on 2026-09-02.

This document records the reusable visual language of BunnyHood and explains how it is applied to BunnyGPT. It is a design extraction, not a page-for-page copy.

## Visual thesis

BunnyGPT should feel like a live intelligence terminal built inside the BunnyHood world: dark, sharp, editorial, slightly mysterious, and unmistakably acid-lime. The product is a working chat surface first. Brand drama supports the conversation instead of pushing it below a marketing hero.

## Core tokens

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#090b08` | Main background |
| Ink soft | `#11140f` | Raised panels |
| Ink elevated | `#151912` | Cards and controls |
| Lime | `#caff00` | Primary action, active state, signal |
| Lime soft | `#ddff61` | Hover and high-emphasis text |
| Paper | `#f3f1e9` | Primary text |
| Muted | `#9ba191` | Secondary text |
| Line | `rgba(202,255,0,.22)` | Brand borders and focus rings |
| Neutral line | `rgba(243,241,233,.12)` | Structural dividers |
| Danger | `#ff7a66` | Error states |

## Typography

- Display: Arial/Helvetica Black-style system sans, weight `900`, very tight tracking.
- Interface labels: system sans, weight `800`, uppercase, tracking around `.12em`.
- Body: Arial/Helvetica, regular, relaxed `1.55–1.7` line height.
- Metadata: system monospace, uppercase, tracking around `.12em`.
- Minimum body size: `16px`; routine controls: `14px`; metadata: `12px`.

## Shape language

- Outer product shell: `24px` radius.
- Main agent art/card: asymmetric arch (`48% 48% 20px 20px`) inspired by the BunnyHood hero frame.
- Buttons: pill-shaped, compact, all caps.
- Chat messages: rounded rectangles with one restrained squared corner to keep them directional.
- Borders: thin and dim by default; lime only for active, selected, live, or focused states.

## Background and texture

- Near-black base.
- Fine 56px grid using extremely low-opacity paper lines.
- Soft radial lime glow, never a full neon wash.
- Decorative orbit lines may appear behind agent art, but never reduce legibility or intercept input.

## Layout translation

### Entry state

- Compact top bar with BunnyHood mark, `BUNNYGPT`, and `PUBLIC BETA` status.
- Oversized two-line `BUNNY / GPT` title on the left.
- Agent selection on the right or directly below on narrower screens.
- Three personality cards use official BunnyHood collection artwork.

### Chat state

- Desktop: fixed-width agent rail + flexible conversation panel.
- Mobile: compact agent strip above the conversation.
- The selected archetype persists for the whole conversation until the user switches.
- The composer is always visible at the bottom of the primary working surface.

## Agent signatures

| Agent | Framing | Signature output |
| --- | --- | --- |
| Quant | Evidence, probabilities, uncertainty | `Confidence` |
| Trader | Momentum, catalysts, levels, timing | `What I’m watching` |
| Contrarian | Consensus risk, missing evidence, downside | `What everyone may be missing` |

All three agents share the same official BunnyHood knowledge. Only interpretation and delivery change.

## Source states

- `BUNNYHOOD KNOWLEDGE`: answer used the embedded official project prompt.
- `LIVE RESEARCH`: You.com was used and source links are shown.
- `HYBRID`: official BunnyHood context and live research were combined.
- Sources appear below the answer, not inside the composer or as decorative badges.

## Motion

- 150–220ms for controls and selection changes.
- 300–450ms for panel reveals.
- A small pulsing lime dot indicates online/research state.
- Respect `prefers-reduced-motion` and remove nonessential motion.

## Accessibility and responsive rules

- Paper-on-ink is the standard reading combination.
- Lime is not used for long paragraphs.
- Focus rings are always visible and lime-tinted.
- Controls remain at least 44px tall where practical.
- At widths below `880px`, the rail becomes a stacked header and the chat fills the screen.
- At widths below `640px`, agent cards become single-column and oversized display text scales down without clipping.

