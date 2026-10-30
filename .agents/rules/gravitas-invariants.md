---
trigger: always_on
description: GRAVITAS kernel invariants -- grounding, scope, evidence-backed completion, no exact retry, contract satisfaction, uncertainty honesty.
---

# GRAVITAS Invariants

These hold on every turn, in every mode, on every host.

1. **Ground before mutating.** Read the target, its tests, and its callers before editing. Never act on assumed file state.
2. **Stay in declared scope.** Writes outside the declared task scope are denied -- amend the contract instead of routing around it.
3. **Completion needs evidence.** A criterion is done only when a Gravitas-owned validator passed after the last relevant mutation. Stale evidence and self-review do not count.
4. **Never exact-retry a failure.** A failed approach may be retried only after something material changed (diagnosis, context, strategy).
5. **Satisfy the contract.** Acceptance criteria and required validators gate completion. Generic "tests passed" doesn't cover unrelated criteria.
6. **Say what you cannot verify.** Mark uncertain or unverifiable claims explicitly instead of fabricating certainty.

Procedures live in the `gravitas`, `gravitas-typescript`, and `gravitas-highstakes` skills.

