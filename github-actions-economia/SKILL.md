---
name: github-actions-economia
description: "Economiza minutos e custos do GitHub Actions em deploys. Use quando um deploy for bloqueado com 'spending limit needs to be increased' ou 'recent account payments have failed', quando os minutos acabarem, ao criar ou otimizar um deploy.yml, ao configurar orçamento de billing no GitHub ou ao perguntar por que o deploy não rodou."
---

# GitHub Actions: Saving Minutes & Costs

This skill bundles proven rules that keep projects with a GitHub Actions deploy
(push to `main` → build → deploy) from hitting the Actions minutes limit,
and that get them unblocked quickly if it happens anyway. Background: GitHub
grants only **2,000 free minutes per month** per **account/org** (Linux, private
repos). Once they are gone **and** the budget is set to $0, **no** job starts
anymore: every further push fails without anything being deployed.

Work in this order: **1. Diagnosis → 2. Unblock (budget) →
3. Slim down the workflow → 4. Keep usage permanently low.**

---

## 1. Diagnosis: is it really the limit?

Typical error message in the failed run (annotation):

> The job was not started because recent account payments have failed or your
> spending limit needs to be increased. Please check the 'Billing & plans' section.

This is **not a code error**. Check the actual usage via the billing API
(it only needs a normal `gh` login, no `admin:org`):

```bash
gh api "/organizations/<ORG>/settings/billing/usage" | python3 -m json.tool
```

Look for the line item `"product": "actions"`. Example:
`quantity: 2000.0 Minutes`, `grossAmount: 12.00`, `discountAmount: -12.00`,
`netAmount: 0.00` → the 2,000 free minutes are **used up exactly**, and $0 has
been paid so far. That is precisely when the $0 budget blocks all further jobs.

Remember: a run triggered while the limit is locked **consumes no minutes**;
the job never starts in the first place. Re-runs achieve nothing as long as the
budget is $0.

---

## 2. Unblocking: set an account budget for Actions

GitHub → Org → **Settings → Billing & plans → Budgets**. The UI asks several
questions; here are the right answers:

| Question | Choose | Why |
|---|---|---|
| **Budget type** | **Product-level budget** | Covers the entire "Actions" product (all minutes SKUs + storage) with a single budget. *Not* "AI credits" (Copilot only) and *not* SKU-level (needlessly granular). |
| **Product** | **Actions** | That is the blocked resource. |
| **Budget scope** | **Account** | Covers **all** repos in the org. The 2,000 free minutes are shared account-wide; an account budget unblocks everything at once. "Repository" would only fix a single repo. |
| **Amount** | **~$15/month** | At $0.006/min that is roughly 2,500 extra minutes. In practice you usually pay $0 because the free minutes remain; the budget only kicks in on real overage. |
| **Stop usage when reached** | **Yes** (leave it) | This turns it into a hard cap at $15 instead of $0. It protects against runaway usage but no longer blocks immediately. |

Additionally, make sure a **valid payment method** is on file (the block message
often also mentions "payment failed").

Leave the **other product budgets** (Codespaces, Packages, Git LFS, AI Credits)
at **$0 + Stop usage Yes**: they are not needed for plain deploys, and this way
they are protected against accidental costs.

**Free alternative:** a **public** repo has **unlimited free** Actions minutes.
For plain website deploys this is often acceptable (secrets live in GitHub
Secrets, not in the code). Choose this only if the source code may be public.

---

## 3. Slim down the workflow

When creating or reworking a `deploy.yml`, apply these five levers. In intensive
phases they cut usage by roughly **50-70%** without making the deploy unsafe.

### a) Cancel superseded runs (biggest lever)
With pushes in quick succession, the older, already superseded run should be
cancelled instead of running to completion:

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: true
```

Safe for static sites with full uploads: the **latest** run re-uploads the
complete `dist/` anyway, so the final state is always the last push. (Only if a
deploy absolutely must be atomic and indivisible, split build and upload into
two jobs instead and make only the build cancellable.)

### b) Do not deploy docs-only/meta changes
```yaml
on:
  push:
    branches: [main]
    paths-ignore:
      - "README.md"
      - "LICENSE"
      - "docs/**"
      - ".vscode/**"
      - ".editorconfig"
```
**Caution:** blog/content files under `src/content/**` are deploy-relevant and
must **not** be ignored. Never exclude `**/*.md` across the board.

### c) Timeout as a safeguard
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 8
```
Prevents a hanging SFTP/deploy step from burning minutes unnoticed.

### d) Faster installation
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "22"
    cache: npm                       # download cache
- run: npm ci --prefer-offline --no-audit --no-fund
- uses: actions/checkout@v4
  with:
    fetch-depth: 1                   # no full history
```

### e) `[skip ci]` for local-only changes
If `[skip ci]` (or `[no ci]`) appears in the commit **subject**, GitHub skips
the run entirely: this is standard GitHub behavior, no configuration needed.
Use it for commits that change nothing on the live site.

### Complete template

A ready-to-use `deploy.yml` as a starting point: adapt the secret names and the
deploy command to the repo at hand, the cost-saving mechanics stay the same:

```yaml
# Template: minute-saving deploy workflow (push to main → build → deploy).
# Adapt the secret names (DEPLOY_*) and the deploy command to the repo at hand.
# The cost-saving mechanics (concurrency, paths-ignore, timeout, fast npm ci) stay the same.
name: Deploy

on:
  push:
    branches: [main]
    paths-ignore:
      - "README.md"
      - "LICENSE"
      - "docs/**"
      - ".vscode/**"
      - ".editorconfig"
  workflow_dispatch: {}

# Cancel superseded runs on quick pushes. Safe for static full uploads:
# the latest run re-uploads the complete dist/, final state = last push.
concurrency:
  group: deploy-production
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 8
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm

      - name: Dependencies
        run: npm ci --prefer-offline --no-audit --no-fund

      - name: Build
        run: npm run build
        # env: hook in PUBLIC_* build secrets here if needed

      # --- Deploy step: insert the repo-specific upload here ---
      # Example SFTP/SSH key deploy:
      - name: Provide SSH deploy key
        run: |
          mkdir -p .secrets
          printf '%s' "$DEPLOY_SSH_KEY" > .secrets/id_ed25519
          chmod 600 .secrets/id_ed25519
        env:
          DEPLOY_SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}

      - name: Deploy
        run: node scripts/deploy.mjs
        env:
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
          DEPLOY_KEY: .secrets/id_ed25519
          DEPLOY_REMOTE_PATH: ${{ secrets.DEPLOY_REMOTE_PATH }}

      - name: Live check
        run: |
          sleep 3
          code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 25 https://EXAMPLE.com/)
          echo "HTTP $code"
          test "$code" = "200"
```

---

## 4. Keep usage permanently low (working habits)

The most expensive usage does not come from long runs but from **many runs**.
Therefore:

- **Batch your changes.** Do not push/deploy every tiny adjustment on its own.
  Collect several related edits, commit once, deploy once. (If every single
  step has to be verified live, that is fine, but it is the exception, not the
  default.)
- **Verify locally before pushing:** run `npm run build` locally; serve the
  finished build locally and check it. Push only once it is right: this saves
  failed runs.
- **Keep an eye on usage:** briefly check the billing usage API once a month
  (see section 1). The reset always happens on the **1st of the month**.

---

## Quick checklist

- [ ] Deploy blocked? → Check the billing usage API (section 1)
- [ ] Account budget for **Actions** set above $0 (for example $15), payment method valid
- [ ] `concurrency: cancel-in-progress: true`
- [ ] `paths-ignore` for docs/meta (but **not** `src/content`)
- [ ] `timeout-minutes` set
- [ ] `cache: npm` + `npm ci --prefer-offline --no-audit --no-fund` + `fetch-depth: 1`
- [ ] Team habit: batch changes, build locally, `[skip ci]` for non-deploy commits
