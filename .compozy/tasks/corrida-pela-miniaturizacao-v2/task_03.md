---
status: completed
title: "Fusão contínua e compra adaptativa"
type: frontend
complexity: high
dependencies:
  - task_02
---

# Task 03: Fusão contínua e compra adaptativa

## Overview
Esta tarefa muda a regra central do jogo para cadeia única de 18 níveis sem reset entre eras. Ela remove a trava local no nível 3 e faz a compra entregar um item base útil ao progresso atual.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST allow two equal global levels to merge into the next global level through level 18.
- MUST reject merges between different global levels.
- MUST preserve empty-slot movement behavior.
- MUST never clear the grid merely because a new era starts.
- MUST trigger new-era callbacks when a merge creates levels 4, 7, 10, 13, or 16.
- MUST trigger final-victory callbacks when a merge creates level 18.
- SHOULD compute purchased item level from progression so older levels do not create excessive grind.
</requirements>

## Subtasks
- [x] 3.1 Update merge rules to use `MAX_GLOBAL_LEVEL` instead of local max level 3.
- [x] 3.2 Emit distinct merge results for new component discovery, new era, and final component creation.
- [x] 3.3 Update buy behavior to spawn an adaptive base global level.
- [x] 3.4 Update render calls so each computer draws from its global level metadata.
- [x] 3.5 Remove quiz-button-era advancement from the merge flow.
- [x] 3.6 Add unit tests for cross-era merges and adaptive purchase boundaries.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: PRD says "item base mais útil" but does not define a formula. Use a conservative, testable rule, such as highest unlocked era base level or a capped level behind current max, and document the chosen rule in code/docs.

### Relevant Files
- `scripts/game/MergeSystem.js` — Current merge logic hard-codes `maxLevel = 3`.
- `scripts/input/DragDrop.js` — Turns merge results into callbacks, particles, and shockwaves.
- `scripts/input/ClickHandler.js` — Current buy behavior always spawns `new Computer(1, ...)`.
- `scripts/game/GameEngine.js` — Current flow queues era quiz and clears grid after quiz success.
- `scripts/render/Renderer.js` — Current sprite draw uses active era plus local computer level.
- `scripts/render/Sprites.js` — Can already draw six eras x three local items.
- `scripts/game/Computer.js` — Stores `level`, which should become global level semantics.

### Dependent Files
- `scripts/ui/HUD.js` — Buy button label and disabled state depend on adaptive buy behavior.
- `scripts/ui/Timeline.js` — Era advancement becomes merge-driven.
- `scripts/ui/ComponentGallery.js` — Collection updates depend on discovered global levels.
- `scripts/storage/SaveManager.js` — Persistence must keep global levels after this task.

## Deliverables
- Merge chain works from level 1 through level 18 without era reset.
- New era and victory events are emitted from merge outcomes.
- Buying creates a useful base item according to a documented rule.
- Existing movement and rejection rules still work.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for cross-era merge flow **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Dropping level 3 onto level 3 returns a successful merge to level 4.
  - [x] Dropping level 17 onto level 17 returns a successful merge to level 18 and final-item flag.
  - [x] Dropping level 18 onto level 18 returns a safe max-level rejection.
  - [x] Dropping level 4 onto level 5 rejects and preserves origin item.
  - [x] Dropping an item onto an empty slot moves it without changing level.
  - [x] Adaptive buy level never exceeds highest discovered or configured cap.
- Integration tests:
  - [x] Browser-driven merge from two level 3 items leaves level 4 on the grid and does not clear the grid.
  - [x] Buy button label reflects the adaptive component name after era advancement.
- Test coverage target: >=80%
- All tests must pass

## Validation Evidence
- `npm run validate` passes.
- Unit tests: 17 passed, 0 failed.
- Unit coverage: 81.98% lines, above the 80% target.
- Browser smoke: 2 Playwright tests passed, including cross-era level 3 -> 4 merge with existing grid item preserved and adaptive N4 buy label.

## Success Criteria
- All tests passing
- Test coverage >=80%
- Grid state survives era transitions.
- No UI path still requires "Avançar para Próxima Era" to progress.
