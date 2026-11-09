---
name: figma-para-codigo
description: "Converte frames, links ou prints do Figma em código HTML/CSS ou React limpo, com tokens de design e estrutura semântica. Use ao receber um design do Figma para implementar."
---

This skill converts a Figma design into maintainable frontend code through a structured process instead of blind pixel tracing.

## When this skill activates
- The user shares a Figma link, frame export, or screenshot and wants HTML/CSS or React built from it.
- A landing page or UI screen needs a faithful implementation in code.
- Existing code must be aligned with an updated Figma design.

## Workflow
1. Capture the source: use the Figma MCP or API when available (frame tree, auto layout, variables). Otherwise estimate sizes, colors, and fonts from a screenshot and flag uncertain values.
2. Extract tokens before markup: colors, font sizes, spacing, radii, and shadows become CSS custom properties. Round odd values to a 4px or 8px grid.
3. Derive the layout model: auto layout maps to flexbox (direction, gap, padding, alignment), grid-like arrangements map to CSS Grid. Absolute positioning only for decorative overlays.
4. Cut repetition into components (Button, Card, NavItem). Figma variants become props or modifier classes.
5. Write semantic HTML: exactly one h1, a clean heading hierarchy, nav/main/section, button vs. a picked by role, labels and alt text.
6. Add the missing states: Figma rarely shows hover, focus-visible, active, disabled, or error states. Derive them from the brand style and build them in.
7. Define responsive behavior: the frame has one fixed width. Decide what stacks or wraps on small viewports; prefer clamp() and fluid spacing over many breakpoints.
8. Verify in the browser: render it, place it next to the design, fix deviations in spacing, font weights, and colors.
9. Briefly document intentional deviations, such as increased contrast.

## Output format
- Working code: a single HTML file with embedded CSS, or React components plus a styles file.
- Tokens collected at the top (custom properties under :root).
- A short note list: assumptions, states added, deviations from the design.

## Quality rules
- No hardcoded colors or spacing in markup; everything flows through tokens.
- No position:absolute for page layout, decoration only.
- Font sizes in rem, spacing on a consistent grid.
- Every interactive element has a visible focus-visible style.
- Text contrast meets WCAG AA at minimum; deviate from the design if needed and note it.
- Class names describe function, not looks (no .blue-box).
- The result was rendered and compared against the design, not just read.
