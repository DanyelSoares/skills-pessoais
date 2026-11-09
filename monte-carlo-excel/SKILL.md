---
name: monte-carlo-excel
description: "Cria uma simulação de Monte Carlo no Excel, sem suplementos, com milhares de cenários aleatórios e faixas de percentis (P10/P50/P90). Use quando custos, prazos ou receitas forem incertos e você quiser a faixa provável do resultado."
---

# Monte Carlo Simulation (No Add-In)

## When to use
Use when a model output (NPV, IRR, EPS, payback) depends on uncertain inputs and a single point estimate hides the risk. This skill BUILDS a downloadable .xlsx from scratch in the Claude app (openpyxl plus numpy), simulating thousands of trials and summarizing the output distribution, with a recalc-and-verify pass. It needs no Crystal Ball, no @RISK, and no add-in, and it is not the Claude for Excel add-in.

## What it builds
Five tabs: `Cover` (run settings and summary), `Assumptions` (each uncertain input and its distribution), `Simulation` (the per-trial engine and outputs), `Results` (trial outputs, percentile and threshold summary, histogram), and `Checks`.

## Build workflow
1. Identify the output cell and the uncertain inputs feeding it.
2. For each uncertain input, choose a distribution and its parameters (normal mean/sd, triangular min/mode/max, uniform min/max).
3. Choose a trial count (state it; 5,000 to 10,000 is a reasonable default).
4. Build BOTH paths: the native RAND-driven Data Table trials and the numpy trial engine (see spec).
5. Compute the percentile summary (P5, P10, P50, P90, P95), mean, standard deviation, and at least one threshold probability such as P(IRR < hurdle).
6. Build a histogram chart of the trial outputs.
7. Add the Checks tab.
8. Recalculate the workbook in a real engine (headless LibreOffice).
9. Verify zero formula errors (#REF!, #DIV/0!, #VALUE!, #NAME?), confirm checks pass, then deliver the .xlsx.

## Tab-by-tab spec

### Assumptions tab
One row per uncertain input: name, distribution type, and parameter cells (all blue).
- Normal: mean, sd. The live draw is `=NORM.INV(RAND(),mean,sd)`.
- Uniform: min, max. Draw `=min+(max-min)*RAND()`.
- Triangular: min, mode, max. Draw with the inverse-CDF formula using `u=RAND()` and `Fc=(mode-min)/(max-min)`:
  `=IF(u<Fc, min+SQRT(u*(max-min)*(mode-min)), max-SQRT((1-u)*(max-min)*(max-mode)))`.
- Note correlation caveat: independent RAND() draws assume inputs are uncorrelated. If drivers move together (price and volume, rate and default), independent sampling understates tail risk; flag it and, if needed, drive correlated inputs from a shared factor rather than separate RAND() calls.

### Simulation tab (native path)
- A row of live draw cells, one per input, using the formulas above; these feed the model so the output cell recomputes per recalculation.
- The output formula `=Model!B40` sits at the corner of a one-variable Data Table.
- Trial index 1..N runs DOWN a column; the Data Table's Column input cell points at an UNUSED scratch cell (not referenced by the model). Because each row forces a full recalculation, every RAND() reseeds and the captured output differs per row. Excel writes `{=TABLE(,<scratch cell>)}` down the trial column.
- This native trick works only after recalculation in a real engine; openpyxl writes the structure but cannot populate it.

### Simulation and Results tabs (numpy path, recommended via code)
- In Python, sample each input distribution N times with numpy (`np.random.normal`, `np.random.triangular`, `np.random.uniform`), evaluate the output function across all N trials vectorized, and write the N trial outputs as plain values to a `Results` column.
- This is deterministic to deliver, avoids volatile RAND() churn, and lets you compute the summary directly.

### Results tab (summary and chart)
- Percentile summary as live formulas over the trial column: `=PERCENTILE.INC(trials,0.05)` for P5, then 0.10, 0.50, 0.90, 0.95.
- `=AVERAGE(trials)` mean and `=STDEV.S(trials)` standard deviation.
- Threshold probability, for example `=COUNTIF(trials,"<"&hurdle)/COUNT(trials)` for P(output < hurdle).
- Histogram: bin the trials (FREQUENCY over a bin column or numpy histogram counts) and insert a bar/column chart of bin counts so the shape is visible.

### Checks tab
- Trial count stated and matches: `=(COUNT(trials)=Cover!B3)` TRUE.
- Summary stats present: P5, P10, P50, P90, P95, mean, sd all non-blank.
- Percentiles monotonic: `=AND(P5<=P10,P10<=P50,P50<=P90,P90<=P95)` TRUE.
- Histogram present (chart object on Results).

### Trial count guidance
- More trials tighten the percentile estimates; the standard error of a percentile shrinks roughly with the square root of the trial count, so going from 1,000 to 10,000 roughly halves the noise.
- For headline percentiles (P5, P95) and small threshold probabilities, lean toward 10,000 trials; the tails need more samples than the median.
- State the trial count on the Cover tab so the result is reproducible and the count check has a reference value.

### openpyxl build notes
- For the numpy path, write trial outputs as plain float values with `ws.cell(...)`; do not store them as formulas, since they are sampled data, not derived cells.
- Write the percentile, mean, sd, and threshold cells as formula strings over the trial range so they stay live if a user edits trials.
- Build the histogram with `openpyxl.chart.BarChart`, feeding a bin-label column and a FREQUENCY (or precomputed count) column as the data series.
- Seed numpy (`np.random.default_rng(seed)`) so a rebuild reproduces the same distribution, and note the seed on the Cover tab.

### Distribution sanity
- Confirm sampled means and spreads roughly match the stated parameters before wiring them in (a triangular with mode outside min/max, or a negative sd, is a common parameter error).
- For inputs bounded by zero (volumes, prices), prefer triangular or a truncated draw over a wide normal that can sample negatives and inject #VALUE! or nonsensical outputs.

## Formula and formatting conventions
- Blue font for distribution parameters, trial count, and the hurdle/threshold.
- Black font for in-tab formulas (draws, percentiles, summary stats).
- Green font for cross-tab links such as `=Model!B40`.
- No hardcodes where a formula belongs: percentile and probability cells are always formulas over the live trial range, never typed numbers.
- One consistent formula per row or column: the same draw formula per input, the same `PERCENTILE.INC` pattern down the summary block.
- Number formats: rates `0.0%`, currency `#,##0`, probabilities `0.0%`. Label every parameter with its units.

## Checks
See the Checks tab: trial count stated and matches the data, all summary stats present, percentiles monotonic, histogram present. All must hold.

## Recalculate and verify
Save with openpyxl, recalc headless (for example `libreoffice --headless --convert-to xlsx`) so `{=TABLE(...)}`, NORM.INV, RAND, and the percentile formulas populate. Reload, scan for #REF!, #DIV/0!, #VALUE!, #NAME?. For the native path, confirm the trial column shows varied values (not a repeated constant, which means the scratch cell was wrong). Confirm percentiles are monotonic and the histogram rendered. Fix and loop until clean, then deliver.

## Inputs to gather
- Path to the model, the output cell, and each uncertain input cell.
- A distribution and its parameters for every uncertain input.
- The trial count and any correlation between inputs.
- The threshold(s) for the probability metric (for example the IRR hurdle).

## Example
Hypothetical NPV model with two uncertain inputs: revenue growth normal (mean 4%, sd 2%) and gross margin triangular (min 50%, mode 55%, max 58%). Running 10,000 trials gives a hypothetical distribution with P5 of 210, P50 of 760, P95 of 1,430 in hypothetical units, mean 770, sd 380, and P(NPV < 0) of 6.5%. The histogram shows a right-skewed shape and the percentiles increase monotonically, confirming the run is valid.
