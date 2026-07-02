---
status: completed
title: "Modelo global de componentes e eras"
type: frontend
complexity: medium
dependencies:
  - task_01
---

# Task 02: Modelo global de componentes e eras

## Overview
Esta tarefa substitui a leitura implícita de "nível dentro da era" por um modelo explícito de 18 níveis globais. Ela é a base para progressão contínua, renderização correta, coleção completa e vitória no nível 18.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST define all 18 global components listed in the PRD with stable global level, era, local item index, name, description, and sprite reference.
- MUST provide helper functions to map global level to era data and local item data.
- MUST keep existing six era theme records available for timeline and visual theme consumers.
- MUST avoid duplicating item names across unrelated structures when a single canonical component list can drive rendering and UI.
- SHOULD expose constants for maximum global level and era-start levels.
</requirements>

## Subtasks
- [x] 2.1 Define canonical component metadata for levels 1-18.
- [x] 2.2 Add helpers for `globalLevel -> era`, `globalLevel -> item`, and `era -> component range`.
- [x] 2.3 Update existing consumers that currently assume `getEra(level)` means item level.
- [x] 2.4 Preserve current era theme behavior for body classes, colors, and backgrounds.
- [x] 2.5 Add tests for level mapping boundaries and invalid inputs.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: there is no approved interface name for the global component registry. Reuse `scripts/config.js` if the registry remains small, or create a focused module only if it reduces coupling for render/UI/game modules.

### Relevant Files
- `scripts/config.js` — Owns current `ERAS_DATA`, item names, quiz data, and `getEra`.
- `scripts/render/Sprites.js` — Already maps six eras and three local item levels to sprite assets.
- `assets/images/sprites/` — Contains assets for all 18 components.
- `scripts/game/Computer.js` — Currently asks `getEra(this.level)` using local item level semantics.
- `scripts/render/Renderer.js` — Draws sprites using active era plus local item level.

### Dependent Files
- `scripts/input/DragDrop.js` — Uses era count and merged level for effects.
- `scripts/ui/ComponentGallery.js` — Must later consume all 18 items.
- `scripts/ui/HUD.js` — Buy label must later use adaptive base item metadata.
- `scripts/storage/SaveManager.js` — Save schema later depends on global levels.

## Deliverables
- Canonical 18-level component metadata available to game, UI, render, and tests.
- Mapping helpers with clear behavior for levels 1, 3, 4, 18, and out-of-range values.
- Existing six-era theme data remains intact.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for existing page boot after metadata refactor **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] `getComponentByLevel(1)` returns Engrenagens in era 1 with local item index 1.
  - [x] `getComponentByLevel(4)` returns Válvula a Vácuo in era 2 with local item index 1.
  - [x] `getComponentByLevel(18)` returns Computador Quântico in era 6 with local item index 3.
  - [x] Invalid level `0` returns `null` or a documented safe value consistently.
  - [x] Era 6 component range includes exactly levels 16, 17, and 18.
- Integration tests:
  - [x] Browser smoke still renders the initial era theme after metadata change.
  - [x] Sprite metadata for all 18 levels points to an existing asset or existing fallback path.
- Test coverage target: >=80%
- All tests must pass

## Validation Evidence
- `npm run validate` passes.
- Unit coverage: 93.70% lines, above the 80% target.
- Unit tests: 12 passed, including 18-level metadata boundaries and sprite asset existence.
- Browser smoke: 1 Playwright test passed loading `game.html` over HTTP with `era-1` body class and initial buy text intact.

## Success Criteria
- All tests passing
- Test coverage >=80%
- All 18 PRD components are represented once in canonical metadata.
- No existing UI text regresses for the initial game state.
