---
name: precificacao-excel
description: "Monta no Excel um modelo de precificação e preço × volume com fórmulas vivas: reação da demanda ao preço, margem e ponto ótimo. Use para definir ou revisar preços de produtos, planos ou serviços."
---

# Pricing Model (Price-Volume and Elasticity)

## When to use
Use when you need to choose a price by modeling how volume responds to it: an elasticity assumption sets how demand changes as price moves, revenue is price times volume, and contribution is unit margin times volume. Good for pricing decisions, packaging and tiering, and contribution optimization. The skill builds a downloadable .xlsx in the Claude app with openpyxl; it does not use any Excel add-in or Microsoft 365 connection.

## What it builds
A workbook with six tabs:
- Cover: title, color legend, scenario selector, headline optimal price and contribution.
- Assumptions: blue inputs (reference price, reference volume, elasticity, variable cost, scenario multipliers).
- Price-Volume: a price grid with volume(price), revenue, and contribution to find the peak.
- Tiers: optional segmented pricing with a mix and blended contribution.
- Sensitivity: price by elasticity Data Table driving contribution.
- Checks: non-negative volume, a clear contribution peak, and margin sanity.

## Build workflow
1. Create the workbook and the six tabs in the order above.
2. On Assumptions, lay out all inputs in blue with units; add a scenario cell (1=Base, 2=Bull, 3=Bear) named `scn`.
3. Build the price grid on Price-Volume from a min, max, and step (all blue inputs).
4. Compute volume(price) from the elasticity formula, then revenue and contribution per grid row.
5. Identify the contribution-maximizing price with MAX and INDEX/MATCH.
6. Build the Tiers tab: per-tier price, volume, margin, and a mix-weighted blended contribution.
7. Build the Sensitivity tab as a native two-variable Data Table (price by elasticity).
8. Build the Checks tab with non-negativity, peak, and margin tests.
9. Recalculate the workbook headless (LibreOffice) so all formulas compute.
10. Verify zero formula errors (#REF!, #DIV/0!, #VALUE!, #NAME?); fix and re-recalculate in a loop, then deliver.

## Tab-by-tab spec

### Assumptions
- B2 Scenario selector (blue, 1/2/3), named `scn`.
- Reference price P0 B5; reference volume Q0 B6.
- Price elasticity of demand B7 (a negative number, e.g. -1.5).
- Variable cost per unit B8.
- Price grid controls: min price B9, max price B10, step B11.
- Scenario multipliers (Base/Bull/Bear) for elasticity and reference volume: active elasticity `=CHOOSE(scn,...)` in B13, active Q0 `=CHOOSE(scn,...)` in B14.

### Price-Volume
- Column A price grid: A3 `=Assumptions!B9`; A4 `=A3+Assumptions!$B$11`; fill down until `>Assumptions!B10`. One consistent step formula.
- Volume(price) column B: constant-elasticity form `=Assumptions!$B$14*(A3/Assumptions!$B$5)^Assumptions!$B$13`. (Volume scales by the price ratio raised to elasticity; with negative elasticity a higher price lowers volume.)
- Optional linear form alternative: `=Assumptions!$B$14*(1+Assumptions!$B$13*(A3-Assumptions!$B$5)/Assumptions!$B$5)`, floored at 0 with `=MAX(0,...)`.
- Revenue column C `=A3*B3`.
- Unit margin column D `=A3-Assumptions!$B$8`.
- Contribution column E `=D3*B3` (unit margin times volume).
- Optimal price: `=INDEX(price_col,MATCH(MAX(contribution_col),contribution_col,0))`.
- Max contribution: `=MAX(contribution_col)`.

### Tiers
- One row per tier: tier price (blue), volume share / mix % (blue, summing to 100%), total addressable volume (blue).
- Tier volume `=mix% * total volume`.
- Tier unit margin `=tier price-Assumptions!$B$8`.
- Tier contribution `=tier volume * tier unit margin`.
- Blended price `=SUMPRODUCT(tier_price,tier_volume)/SUM(tier_volume)`.
- Total tiered contribution `=SUM(tier contribution column)`.
- Mix check: `=SUM(mix%)` should equal 1.

### Sensitivity
- Top-left corner references contribution at the chosen price `=Price-Volume!<contribution at optimal or reference price>`.
- Column input: price values. Row input: elasticity values.
- Native two-variable Data Table with row input cell = Assumptions elasticity and column input cell = a single price cell that feeds a contribution formula.

### Checks
- Non-negative volume: `=IF(MIN(volume_col)>=0,"PASS","FAIL")`.
- Clear peak: `=IF(AND(MAX(contribution_col)>contribution_first,MAX(contribution_col)>contribution_last),"PASS","FAIL")` so the maximum is interior, not at a grid edge (widen the grid if it fails).
- Margin positive at the optimal price: `=IF(optimal_price>Assumptions!B8,"PASS","FAIL")`.
- Tier mix sums to 100%.
- Elasticity is negative (a price increase should not raise volume).

## Formula and formatting conventions
- Blue font for inputs (Assumptions and Tiers inputs). Black for in-tab formulas. Green for cross-tab links.
- No hardcoded numbers in formulas; the grid min/max/step, P0, Q0, elasticity, and cost all live as blue cells. Use absolute refs to those drivers so grid rows fill cleanly.
- One consistent formula per column down the price grid so it copies without edits.
- Prices, margins, revenue, and contribution as currency; mix and elasticity as plain numbers (elasticity negative); volume with thousands separators.
- Name `scn`, the price grid range, and the contribution range for readable optimum and Sensitivity formulas.

## Checks
- Volume non-negative across the whole grid.
- The contribution curve has a clear interior peak (not pinned to a grid edge).
- Unit margin and margin per unit shown and positive at the chosen price.
- Tier mix sums to 100%; elasticity is negative.

## Recalculate and verify
After writing, recalculate headless with LibreOffice so openpyxl formula text becomes computed values. Scan every sheet for #REF!, #DIV/0!, #VALUE!, #NAME?. The power form `(price/P0)^elasticity` can misbehave if P0 is zero, so guard reference price as a positive blue input. Fix any offending formula or missing named range and recalculate again in a loop. Deliver only when the Checks tab shows all PASS and no error strings remain.

## Inputs to gather
- Reference price and reference volume (a known point on the demand curve).
- Price elasticity of demand (negative) and the variable cost per unit.
- Price grid min, max, and step to sweep.
- Optional tier prices, mix percentages, and total addressable volume.
- Scenario multipliers for elasticity and reference volume (Base/Bull/Bear).

## Example
Hypothetical: reference price 100, reference volume 10,000, elasticity -1.5, variable cost 40. At price 100 volume is 10,000 and contribution 600,000. Sweeping price from 60 to 160 in steps of 5, volume falls as price rises; contribution peaks at an interior price (near 120 in this curve) where the unit-margin gain offsets volume loss. A two-tier mix of 70% at 90 and 30% at 140 yields a blended price of 105 and its own total contribution to compare against the single optimal price.
