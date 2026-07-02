---
status: completed
title: "Base de validação e documentação local"
type: infra
complexity: medium
dependencies: []
---

# Task 01: Base de validação e documentação local

## Overview
Esta tarefa cria a base mínima para validar as mudanças v2 sem depender de cliques manuais no navegador. Ela também corrige documentação local que ainda descreve caminhos e comportamento da v1, reduzindo ambiguidade para todas as tarefas seguintes.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST add a local validation path for ES module unit tests that can run from the repository root.
- MUST add a browser smoke validation path for loading `game.html` through an HTTP server.
- MUST document the real `scripts/`, `styles/`, and `css/` structure instead of stale `js/` references.
- MUST preserve the existing zero-build static deployment model unless a later task explicitly changes it.
- SHOULD document that `_techspec.md` is missing and that task implementers must derive implementation details from PRD plus code.
</requirements>

## Subtasks
- [x] 1.1 Add minimal project scripts for unit tests, smoke tests, and local serving.
- [x] 1.2 Add initial test directories and fixtures for pure JavaScript module tests.
- [x] 1.3 Add a browser smoke test that opens `game.html` and verifies the core UI mounts.
- [x] 1.4 Update README architecture paths and run instructions to match current files.
- [x] 1.5 Document validation commands for future task executors.

## Implementation Details
No `_techspec.md` exists for this feature; implementation must follow existing vanilla JS patterns and keep the game deployable as static files. Prefer a small test setup that targets pure modules first (`Economy`, `Grid`, `MergeSystem`, `SaveManager`) and a smoke check for browser wiring.

### Relevant Files
- `README.md` — Current run and architecture documentation is stale in several places.
- `package-lock.json` — Existing lockfile has no useful package metadata; update consistently if adding dev tooling.
- `game.html` — Primary browser smoke target.
- `scripts/game.js` — Game bootstrap that smoke tests need to verify.
- `scripts/game/Economy.js` — Pure module candidate for first unit tests.
- `scripts/game/Grid.js` — Pure module candidate for first unit tests.
- `scripts/game/MergeSystem.js` — Pure module candidate for first unit tests.

### Dependent Files
- `package.json` — Create if adopting npm scripts for validation.
- `tests/` — Create unit and browser smoke tests here or in an equivalent project-local test folder.
- `CONTRIBUTING.md` — Affected only if validation workflow documentation is better placed there than in README.

## Deliverables
- Local test and smoke-test scripts runnable from the repository root.
- README updated with real project paths and validation commands.
- At least one unit test file covering existing pure modules.
- At least one browser smoke test for `game.html`.
- Unit tests with 80%+ coverage for touched validation helpers **(REQUIRED)**.
- Integration tests for browser boot smoke **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] `Grid` initializes exactly 12 slots for a 3x4 board.
  - [x] `Grid.getSlotAt()` returns `-1` for coordinates outside the canvas bounds.
  - [x] `Economy.getBuyCost()` returns `10` before purchases and applies `1.15` inflation after purchases.
  - [x] Test scripts exit non-zero when a known assertion fails.
- Integration tests:
  - [x] HTTP-served `game.html` loads without uncaught module errors.
  - [x] `#game-canvas`, `#btn-research`, `#btn-buy`, `#timeline-list`, and `#modal-load-save` exist after load.
  - [x] Smoke test can clear localStorage before load without crashing the game.
- Test coverage target: >=80%
- All tests must pass

## Validation Evidence
- `npm run validate` passes.
- Unit coverage: 99.15% lines, above the 80% target.
- Browser smoke: 1 Playwright test passed loading `game.html` over HTTP.

## Success Criteria
- All tests passing
- Test coverage >=80%
- `npm test` or documented equivalent runs pure module tests from the repository root.
- Browser smoke command loads the game through HTTP, not `file://`.
- README no longer points developers to non-existent `js/` paths.
