---
status: completed
title: "Coleção vertical de 18 componentes"
type: frontend
complexity: high
dependencies:
  - task_02
  - task_04
  - task_05
---

# Task 06: Coleção vertical de 18 componentes

## Overview
Esta tarefa transforma a galeria atual de três itens em uma coleção persistente de 18 componentes. Ela deve mostrar descobertos, silhuetas futuras, agrupamento por era e painel de consulta por clique.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST render all 18 component slots in the right-side collection.
- MUST group components by era with discreet headers.
- MUST show undiscovered future components as silhouette or question-mark states.
- MUST mark a component discovered when its global level is first created.
- MUST persist discovered components through save/load.
- MUST open a component detail panel only for discovered components.
- SHOULD animate first discovery with highlight, sound, and movement toward the collection.
</requirements>

## Subtasks
- [x] 6.1 Replace current three-item gallery DOM with data-driven 18-component collection.
- [x] 6.2 Add discovered/locked visual states and era grouping.
- [x] 6.3 Add component detail modal/panel with image, name, era, and description.
- [x] 6.4 Connect merge-created components to collection discovery state.
- [x] 6.5 Persist and restore collection state through save version 2.
- [x] 6.6 Add tests for collection rendering and detail gating.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: exact descriptions per component are not fully specified beyond GDD examples. Use existing era descriptions and component metadata as initial content, keeping copy centralized for later educational edits.

### Relevant Files
- `scripts/ui/ComponentGallery.js` — Current gallery only knows three `.gallery-item` nodes.
- `game.html` — Right sidebar currently hard-codes three gallery items.
- `styles/game.css` — Gallery container, item, preview, highlight, and scrollbar styles.
- `scripts/config.js` — Component metadata and descriptions should come from canonical data.
- `scripts/game/GameEngine.js` — Must update discovery state after merges and load/save.
- `scripts/storage/SaveManager.js` — Must persist discovered global levels.
- `scripts/render/Sprites.js` — Renders preview canvases from era/local item mapping.

### Dependent Files
- `scripts/ui/TutorialSystem.js` — Tour must target collection after this task.
- `scripts/input/DragDrop.js` — Merge results must expose discovered global level.
- `scripts/audio/SoundManager.js` — Discovery sound can reuse or add a small cue.

## Deliverables
- Right collection shows all 18 components grouped by era.
- Discovered state updates on first creation and survives reload.
- Locked items show curiosity-friendly silhouettes or question marks.
- Component detail panel opens for discovered items and blocks locked items.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for discovery, locked state, and detail modal **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Collection model marks level 1 discovered in a new game.
  - [x] Marking level 4 discovered does not automatically discover levels 5-18.
  - [x] Locked level 18 returns locked display metadata.
  - [x] Discovered level 12 returns IBM PC name and era 4.
- Integration tests:
  - [x] Initial browser load renders 18 collection entries.
  - [x] Clicking locked Computador Quântico does not open discovered detail content.
  - [x] Creating a new global level updates its collection entry to discovered.
  - [x] Reload after save preserves discovered collection entries.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- The right sidebar no longer displays only current-era N1/N2/N3.
- Players can inspect discovered component details from the collection.
