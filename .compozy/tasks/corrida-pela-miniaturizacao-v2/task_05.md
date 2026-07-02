---
status: completed
title: "Layout principal v2 e timeline superior"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_04
---

# Task 05: Layout principal v2 e timeline superior

## Overview
Esta tarefa reorganiza a tela para o layout alvo do GDD: timeline e PP no topo, ações à esquerda, grid central e coleção à direita. Ela mantém os sistemas existentes, mas reposiciona a hierarquia visual para reduzir painéis genéricos e espaços mortos.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST place six-era timeline in the top region with active marker and progressed trail.
- MUST integrate current PP in the top region without duplicating conflicting PP displays.
- MUST keep Realizar Pesquisa and Comprar Peças stacked in the left action region.
- MUST keep the merge grid as the dominant central element.
- MUST reserve the right side for the 18-component collection.
- MUST keep Bugsy help and phone placement available as corner anchors for later tasks.
- SHOULD improve responsive behavior for desktop and mobile without overlapping text or controls.
</requirements>

## Subtasks
- [x] 5.1 Restructure `game.html` regions for top, left actions, center grid, right collection, and corner anchors.
- [x] 5.2 Update CSS layout rules for desktop and mobile viewports.
- [x] 5.3 Update `Timeline` rendering to support top horizontal progress and trail state.
- [x] 5.4 Update `HUD` selectors so PP, PP/s, click power, and buy cost still update.
- [x] 5.5 Preserve existing mute/reset controls in a non-competing utility area.
- [x] 5.6 Add smoke tests for responsive layout landmarks.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: exact pixel layout is not specified. Use current design language, but follow GDD hierarchy and avoid nested cards for page-level regions.

### Relevant Files
- `game.html` — Owns DOM structure for header, sidebars, grid, gallery, and modals.
- `styles/game.css` — Main layout, panels, board, buttons, timeline, gallery, and tutorial styles.
- `styles/menu.css` — Modal and control styles that may need layout-safe adjustments.
- `css/themes.css` — Theme variables used by panels, timeline, gallery, and modals.
- `scripts/ui/HUD.js` — Selects currency, click power, buy cost, and slot count nodes.
- `scripts/ui/Timeline.js` — Currently renders vertical timeline items inside left sidebar.

### Dependent Files
- `scripts/ui/ComponentGallery.js` — Right-side collection task depends on stable container.
- `scripts/ui/TutorialSystem.js` — Spotlight targets change when layout regions move.
- `scripts/input/ClickHandler.js` — Button IDs must remain stable or be updated.
- `scripts/game/GameEngine.js` — Initializes HUD and Timeline by DOM IDs.

## Deliverables
- Main screen matches GDD region hierarchy.
- Timeline is top-oriented with progress state.
- HUD remains functional after DOM restructuring.
- Desktop and mobile layouts avoid visible overlap.
- Unit tests with 80%+ coverage for touched UI helpers **(REQUIRED)**.
- Integration tests for layout landmarks and HUD updates **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] `Timeline.update()` marks eras before active as unlocked and active era as active.
  - [x] `HUD.update()` updates the top PP element when coins change.
  - [x] `HUD.update()` keeps buy button disabled when grid is full.
- Integration tests:
  - [x] At desktop viewport, top timeline, left actions, grid, and right collection containers are all visible.
  - [x] At mobile viewport, action buttons and grid remain reachable without text overlap.
  - [x] Clicking Realizar Pesquisa updates PP in the top region.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- No visible duplicate "PP atuais" counters disagree after a research click.
- Timeline no longer occupies the left action column.
