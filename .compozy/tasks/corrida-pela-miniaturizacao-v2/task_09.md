---
status: pending
title: "Bugsy ajuda, Bugze e Técnico de TI"
type: frontend
complexity: high
dependencies:
  - task_04
  - task_05
  - task_06
---

# Task 09: Bugsy ajuda, Bugze e Técnico de TI

## Overview
Esta tarefa transforma Bugsy em guia permanente e, a partir da era 3, em Bugze antagonista que drena PP. Ela adiciona tour completo com spotlight, FAQ/rever tour, telefone, Técnico de TI e tutorial impessoal da primeira invasão.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST expand first-run Bugsy tour to cover grid, research, buy, collection, timeline, and help button.
- MUST leave Bugsy anchored as a help button after the tour.
- MUST provide FAQ/help panel and option to replay tour.
- MUST trigger corruption scene when era 3 is reached.
- MUST spawn Bugze invasions from era 3 onward using configurable timing and duration.
- MUST drain PP continuously while Bugze is active and stop draining when resolved.
- MUST expose a phone icon from era 3 onward with Contratar Técnico de TI action and PP cost.
- MUST guide first Bugze invasion with impersonal phone highlight/tutorial.
</requirements>

## Subtasks
- [ ] 9.1 Expand `TutorialSystem` script and spotlight targets for all required regions.
- [ ] 9.2 Add persistent Bugsy help button and FAQ/replay panel.
- [ ] 9.3 Add era 3 corruption scene and Bugze visual state.
- [ ] 9.4 Add Bugze invasion scheduler, active state, and PP drain.
- [ ] 9.5 Add phone menu and Técnico de TI resolution flow.
- [ ] 9.6 Persist Bugze/tutorial/help state through save version 2.
- [ ] 9.7 Add tests for tour, drain, phone resolution, and persistence.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: exact Bugze spawn cadence, drain rate, technician cost, and animation details are not specified. Use configurable prototype constants and keep all values easy to rebalance.

### Relevant Files
- `scripts/ui/TutorialSystem.js` — Current Bugsy tutorial has four stages and one frustration scene.
- `game.html` — Contains Bugsy overlay and unused Amelia overlay; needs help button, phone menu, and invasion overlay.
- `styles/game.css` — Contains tutorial, Bugsy, highlight, and angry visual styles.
- `scripts/game/GameEngine.js` — Owns era state, update loop, save/load, pause, and system wiring.
- `scripts/game/Economy.js` — Needs continuous drain and technician payment paths.
- `scripts/storage/SaveManager.js` — Must persist Bugze and tutorial/help flags.
- `scripts/audio/SoundManager.js` — Needs or reuses alarm/glitch/click cues.

### Dependent Files
- `scripts/ui/HUD.js` — Must reflect drained PP immediately.
- `scripts/ui/Timeline.js` — Tour and era 3 corruption depend on timeline state.
- `scripts/ui/ComponentGallery.js` — Tour targets collection entries.

## Deliverables
- Complete first-run tour with spotlight for all GDD regions.
- Persistent Bugsy help button with FAQ and replay.
- Era 3 corruption scene and Bugze active state.
- Phone + Técnico de TI flow removes Bugze for PP cost.
- Bugze state persists safely through save/load.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for first invasion and technician flow **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] New tour script includes grid, research, buy, collection, timeline, and help steps.
  - [ ] Bugze scheduler returns inactive before era 3.
  - [ ] Active Bugze drain over 5 seconds subtracts expected PP and never makes PP negative.
  - [ ] Hiring technician with enough PP clears Bugze and subtracts configured cost.
  - [ ] Hiring technician with insufficient PP leaves Bugze active and PP unchanged.
  - [ ] Save/load preserves whether first-invasion tutorial has already run.
- Integration tests:
  - [ ] After reaching era 3, corruption overlay appears once.
  - [ ] First Bugze invasion highlights phone before requiring player action.
  - [ ] Clicking phone then Contratar Técnico de TI removes active Bugze and stops drain.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Bugsy help remains accessible after corruption.
- Bugze cannot drain PP before era 3.
