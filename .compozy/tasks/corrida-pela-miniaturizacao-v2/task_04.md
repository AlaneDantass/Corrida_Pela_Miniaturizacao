---
status: completed
title: "Economia, persistência v2 e ganhos offline"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_03
---

# Task 04: Economia, persistência v2 e ganhos offline

## Overview
Esta tarefa torna PP/s, save, offline earnings e prestígio compatíveis com níveis globais. Ela também corrige a lacuna atual em que `calculateCps()` retorna zero e o offline usa dados que não existem em `ERAS_DATA`.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST calculate PP/s from global component levels and prestige multiplier.
- MUST preserve active click PP formula from PRD with era-based scaling.
- MUST persist save version 2 with grid global levels, discovered components, max global level, unlocked eras, prestige, tutorial flags, and Bugze state placeholder.
- MUST migrate or safely ignore version 1 saves without crashing.
- MUST calculate offline earnings from saved global levels using the same production rules as live PP/s.
- MUST save after key actions and retain 30-second autosave behavior.
</requirements>

## Subtasks
- [x] 4.1 Define PP/s values or formula for global levels 1-18.
- [x] 4.2 Update live economy calculations for grid production and prestige.
- [x] 4.3 Add save version 2 fields for global progression, collection, and Bugze-ready state.
- [x] 4.4 Add migration or fallback behavior for existing version 1 saves.
- [x] 4.5 Fix offline earnings to use global component production.
- [x] 4.6 Add tests for production, save/load, migration, and offline caps.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: PRD asks recalibration but does not define exact PP/s or quiz reward numbers. Choose deterministic placeholder formulas suitable for prototype balancing and isolate constants so later balancing does not rewrite save logic.

### Relevant Files
- `scripts/game/Economy.js` — Current `calculateCps()` returns `0`.
- `scripts/storage/SaveManager.js` — Current save version is `1` and offline reads missing `coinsPerSecond`.
- `scripts/game/GameEngine.js` — Owns autosave, load, reset, prestige, victory, and state fields.
- `scripts/game/Computer.js` — Currently exposes `getCoinsPerSecond()` through `getEra(this.level)`.
- `scripts/config.js` — Best place for shared economy constants if keeping static config centralized.
- `scripts/ui/HUD.js` — Displays PP, PP/s, click power, buy cost, and slots.

### Dependent Files
- `scripts/input/ClickHandler.js` — Buy/research actions must save and display correct PP changes.
- `scripts/ui/QuizSystem.js` — Later quiz rewards add PP through economy APIs.
- `scripts/ui/ComponentGallery.js` — Collection persistence depends on discovered component fields.
- `game.html` — Load-save modal may display max era or max global level.

## Deliverables
- Live PP/s works for occupied grid items.
- Offline earnings use same production model and obey cap.
- Save version 2 stores v2 progression state and handles old saves safely.
- Prestige multiplier affects click and production consistently.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for save/load/offline behavior **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Empty grid returns `0` PP/s.
  - [x] Grid with one level 1 item returns expected base PP/s.
  - [x] Prestige count `2` applies `2.0x` multiplier to click value and PP/s.
  - [x] Version 2 save/load preserves coins, grid levels, discovered components, and max global level.
  - [x] Version 1 save with `{ slot, level }` grid data loads without throwing.
  - [x] Offline earnings over cap hours are capped at `OFFLINE_EARNINGS_CAP_HOURS`.
- Integration tests:
  - [x] Reloading after a save restores a level 4 item as level 4, not era-local level 1.
  - [x] Load-save modal shows restored progress and allows continuing.
- Test coverage target: >=80%
- All tests must pass

## Validation Evidence
- `npm run validate` passes.
- Unit tests: 21 passed, 0 failed.
- Unit coverage: 84.84% lines, above the 80% target.
- Browser smoke: 4 Playwright tests passed, including save modal continue and level 4 global-level restore.

## Success Criteria
- All tests passing
- Test coverage >=80%
- HUD PP/s is non-zero when production-capable items are on the grid.
- Old localStorage saves do not crash game boot.
