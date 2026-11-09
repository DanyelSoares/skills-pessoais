---
name: personas-b2b
description: "Transforma anotações de CRM, entrevistas e pesquisas em personas B2B baseadas em evidências. Use ao pedir 'monte personas a partir destes dados'."
---

This skill turns raw research and CRM data into B2B personas that marketing, sales, and product can actually act on.

## When this skill activates
- The user provides CRM notes, call summaries, or interview quotes and wants personas derived from them.
- Existing personas need sharpening, merging, or a reality check against fresh data.
- A persona workshop needs a solid working draft plus validation questions.

## Workflow
1. Count the evidence: independent data points (interviews, CRM records, win/loss notes) per assumed segment. Below 5, label the whole profile as a hypothesis.
2. Code the raw data: per data point, extract role, buying trigger, pain point, objection, success criterion, and channels. Keep verbatim quotes with sources, do not paraphrase.
3. Cluster by job-to-be-done and buying-center role (economic buyer, user, champion, gatekeeper), not by demographics. Same buying problem means same cluster.
4. Decide the count: 2 to 4 personas. Merge cluster pairs that would get the same message through the same channels.
5. Write each persona against the fixed template; back every statement with a source or label it as "hypothesis".
6. Define a negative persona: who looks like a customer but is not (too small, wrong use case, no budget)? Which early signals reveal this to sales?
7. Draft 5 to 8 validation questions that confirm or kill specific hypotheses ("When did you last see this in a deal?").
8. Derive one core message and the key channel implication per persona.

## Output format
One Markdown document: (1) a profile per persona with name, role, company context, buying trigger, top 3 pains in the customer's own words, success criteria, objections, buying-center role, channels, and one verbatim quote; (2) an evidence table (statement, source, evidence or hypothesis); (3) the negative persona; (4) validation questions; (5) a core message per persona.

## Quality rules
- Pain points in customer language, ideally as verbatim quotes with sources.
- No demographic filler (age, hobbies) unless it changes the buying decision.
- At most 4 personas; clusters with identical messaging get merged.
- Each persona contains at least one verbatim quote, otherwise the profile carries the hypothesis label.
- The buying-center role is a mandatory field; without it the persona is incomplete.
- No invented details or numbers that are not in the supplied data.
