# Design Brief

## Direction
FileVault — secure personal file storage with dark navy/slate palette and teal accent, card-based layout, professional yet approachable.

## Tone
Refined minimalism with intentional accent usage; secure, modern, tech-forward without coldness.

## Differentiation
Teal accent reserved for critical actions (upload, delete, active states) creates visual hierarchy while keeping the interface focused on file content.

## Color Palette

| Token      | OKLCH            | Role                                 |
| ---------- | ---------------- | ------------------------------------ |
| background | 0.145 0.01 240   | Deep slate, primary surface          |
| foreground | 0.95 0.01 240    | High contrast text                   |
| card       | 0.18 0.012 240   | File card background                 |
| primary    | 0.72 0.14 185    | Deep navy/indigo (interactive)       |
| accent     | 0.68 0.16 180    | Teal accent (CTAs, highlights)       |
| muted      | 0.22 0.012 240   | Secondary surfaces, dividers         |

## Typography

- Display: Space Grotesk — headings, hero text, file list labels
- Body: DM Sans — body copy, file metadata, UI labels
- Scale: hero `text-4xl md:text-5xl font-bold`, h2 `text-2xl md:text-3xl font-bold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-sm md:text-base`

## Elevation & Depth

Card-based elevation: light shadows (2–4px blur) on file cards, no hover lift, muted borders at 0.28 L for visual separation.

## Structural Zones

| Zone    | Background          | Border              | Notes                              |
| ------- | ------------------- | ------------------- | ---------------------------------- |
| Header  | 0.145 0.01 240      | bottom border 0.28  | Logo, user menu, fixed height     |
| Content | 0.145 0.01 240      | —                   | Upload zone + file grid           |
| Footer  | 0.18 0.012 240      | top border 0.28     | Simple copyright, no decoration   |

## Spacing & Rhythm

16px base unit: gap-4 between cards, gap-2 within cards, p-4 on card padding. Upload zone 2x vertical padding for emphasis.

## Component Patterns

- Buttons: Teal accent for primary CTA (upload, confirm delete), slate for secondary
- Cards: 0.5rem rounded, card shadow, muted border on hover
- Badges: Teal accent for file type indicators, muted background
- Modals: Centered on screen, dark overlay, card elevation with teal accent button

## Motion

- Entrance: Fade + 0.3s transition on modal, file card entrance 0.2s stagger
- Hover: Button color shift 0.2s, card border highlight 0.3s
- Decorative: None; motion reserved for functional feedback

## Constraints

- No decorative gradients, patterns, or blur effects
- Teal used only for primary actions (upload, delete confirm, active states)
- Max 80 char line height for readability on large screens

## Signature Detail

Teal accent reserved for high-importance actions creates unambiguous visual hierarchy in a minimal interface.
