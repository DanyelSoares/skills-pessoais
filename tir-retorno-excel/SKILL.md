---
name: tir-retorno-excel
description: "Calcula no Excel a TIR (IRR/XIRR), o múltiplo do capital (MOIC), o payback e a sensibilidade do retorno a partir de um fluxo de caixa. Use para avaliar investimentos, como energia solar, equipamentos ou projetos."
---

# IRR / MOIC Calculator

## When to use
Use when someone needs a general returns engine for a dated investment cash-flow stream: IRR and XIRR, MOIC, a gross versus net comparison after fees and carry, a holding-period return, and a small two-way sensitivity of exit value by exit year. This skill builds a downloadable .xlsx in the Claude app using openpyxl; it does not run inside any Excel add-in.

## What it builds
- Cover: title, color legend, named-range list.
- Cash Flows: dated flows where negative is invested and positive is returned.
- Returns: IRR, XIRR, MOIC, gross vs net, holding-period return.
- Sensitivity: exit value by exit year grid driving IRR.
- Checks: XIRR convergence, MOIC positive, sign sanity.

## Build workflow
1. Create the workbook and the five tabs above.
2. Enter dated cash flows on Cash Flows as blue inputs.
3. Build the Returns tab formulas referencing the flow ranges.
4. Build the Sensitivity grid with a data-table style of recomputed IRR.
5. Wire Checks to TRUE/FALSE tests.
6. Apply number formats and the color convention.
7. Recalculate the workbook in Microsoft Excel with `scripts/recalc_excel.py` so all formulas compute.
8. Verify zero formula errors (#REF!, #DIV/0!, #VALUE!, #NAME?), fix in a loop, then deliver.

## Tab-by-tab spec

### Cover
- Row 1 model title; row 3 a one-line purpose; row 5 build date.
- Color legend block: blue = input, black = formula, green = cross-tab link.
- Named-range index listing Flows, Dates, Carry, FeeRate and the cell each resolves to.
- A scenario toggle cell (Base / Upside / Downside) wired by data validation, used by sensitivity defaults.

### Cash Flows (blue)
- Column A Date, B Cash Flow (negative invested, positive returned), C Label.
- Helper: Outflows `=SUMIF(B:B,"<0")`, Inflows `=SUMIF(B:B,">0")`.
- Net profit: `=Inflows+Outflows` (outflows already negative).
- Count guard: `=COUNTIF(B:B,"<0")` and `=COUNTIF(B:B,">0")` to feed the sign-sanity check.
- Define named ranges Flows (B range), Dates (A range). Keep one row per cash event so XIRR sees distinct dates.

### Returns
- IRR (periodic): `=IRR(Flows)` assuming evenly spaced periods.
- XIRR (dated): `=XIRR(Flows, Dates, 0.1)` with a 0.1 guess for convergence.
- MOIC: `=Inflows / -Outflows` formatted 0.0x.
- Holding period (years): `=(MAX(Dates)-MIN(Dates))/365`.
- Holding-period return: `=MOIC-1` formatted 0.0%.
- Gross vs net: take gross flows, then net flows after a fee drag and carry. Net inflow `=GrossInflow - MgmtFees - MAX(0, (GrossProfit)*Carry)` where GrossProfit `=Inflows + Outflows`. Net IRR: `=XIRR(NetFlows, Dates, 0.1)`. Net MOIC: `=NetInflows/-Outflows`.
- Show gross and net side by side so the fee and carry impact on IRR and MOIC is explicit.
- Annualized check: `=(MOIC)^(1/HoldYears)-1` should sit close to XIRR for a single in/single out; large gaps flag interim flow timing and are worth surfacing in a note cell.

### openpyxl build notes
- Write formulas as strings to `ws["B5"] = "=XIRR(Flows,Dates,0.1)"`; never assign a precomputed number where a formula belongs.
- Create named ranges via `DefinedName` on the workbook so cross-tab links read cleanly.
- Set `ws.column_dimensions[...].width` and apply `numFmt` per column rather than per cell to keep the file small.

### Sensitivity
- Two-way grid: rows are Exit Value (blue axis down the left), columns are Exit Year (blue axis across the top).
- Top-left anchor cell links to the IRR formula: `=Returns!XIRR_cell`.
- Each axis-year column carries an exit date helper: `=EntryDate + ColumnYear*365`.
- Build each grid cell as a self-contained `=XIRR` over the same early outflows plus a single exit inflow placed at the row/column's exit date and value, so the grid is fully live (do not rely on Excel What-If data tables, which openpyxl cannot populate; write explicit per-cell XIRR formulas instead). A clean pattern: stack the original outflows in a hidden helper block and append `{RowExitValue}` dated at the column helper, then `=XIRR(helper_flows, helper_dates, 0.1)`.
- Add a paired MOIC grid below using `=RowExitValue/-Outflows` so value and time effects are both visible.
- Format the IRR grid as 0.0%, the MOIC grid as 0.0x, and apply a 3-color scale for quick reading.

## Formula and formatting conventions
Blue font for inputs (cash flows, fee and carry rates, sensitivity axes). Black for in-tab formulas. Green for cross-tab links (`CashFlows!`, `Returns!`). No hardcoded numbers inside formulas; use named ranges and axis cells. One consistent formula per row and per grid cell. Percentages 0.0%, dollars with separators, MOIC 0.0x.

## Checks
- XIRR converges: `=ISNUMBER(XIRR_cell)` is TRUE (guess supplied).
- MOIC positive: `=MOIC>0`.
- Sign sanity: `=AND(MIN(Flows)<0, MAX(Flows)>0)` so there is at least one outflow and one inflow.
- Net not above gross: `=NetIRR<=GrossIRR`.
- MOIC and return tie: `=ROUND((MOIC-1)-HoldPeriodReturn,4)=0`.
- Sensitivity anchor matches base: `=ROUND(grid_base_cell - Returns!XIRR_cell,4)=0`.

## Recalculate and verify

> **Ambiente padrão: Windows com Microsoft Excel.** Recalcule no próprio Excel, não no LibreOffice:
> `python scripts/recalc_excel.py <arquivo.xlsx>` (requer `pip install pywin32 openpyxl`). O script abre o arquivo no Excel
> invisível, faz o recálculo completo (incluindo Tabelas de Dados `=TABLE()`, RAND e XIRR), salva e lista qualquer erro de fórmula.
> Repita até sair "OK". Use LibreOffice headless apenas se o Excel não estiver disponível.

After writing, recompute headless so IRR, XIRR, and every sensitivity cell resolve. Scan all cells for #REF!, #DIV/0!, #VALUE!, #NAME?. The most common failure is XIRR returning #NUM! when no guess is given or when signs are all one direction; supply the 0.1 guess and confirm the sign-sanity check passes. MOIC #DIV/0! means outflows are zero; trace and fix. Recalc until clean, then deliver.

## Inputs to gather
Dated cash flows with amounts and signs, any management fees and carry terms for the net view, the entry date, and the exit value and exit year ranges for the sensitivity. If only a single in and single out are known, the model still works; interim flows simply refine XIRR.

## Edge cases to handle
- All-negative or all-positive streams have no IRR; the sign-sanity check catches these before delivery.
- Same-day flows break the holding period divisor; collapse duplicate dates or nudge by a day with a clear note.
- Very high returns can need a larger guess; if XIRR still fails, try `0.5` and document it in a note cell.

## Example
Hypothetical: invest -100 on a start date, receive +250 five years later. MOIC `=250/100=2.5x`, XIRR about 20% per year, holding-period return 150%. After a 2% annual fee and 20% carry on the 150 profit, net MOIC drops modestly and net IRR falls a few points below gross. The sensitivity shows exit value 200 to 300 across years 4 to 6 producing a grid of IRRs.
