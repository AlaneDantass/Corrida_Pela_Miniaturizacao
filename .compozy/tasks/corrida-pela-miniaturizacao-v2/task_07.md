---
status: completed
title: "Transição automática de era e historinhas"
type: frontend
complexity: high
dependencies:
  - task_03
  - task_04
  - task_05
---

# Task 07: Transição automática de era e historinhas

## Overview
Esta tarefa troca o avanço por botão/quiz-portão por uma transição automática disparada pela fusão que cria nova era. Ela também substitui o card seco por historinha multi-quadro, pulável e reexibível pela timeline.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST trigger era transition automatically when levels 4, 7, 10, 13, or 16 are first created.
- MUST remove quiz as required gate for era transition.
- MUST keep grid contents intact during and after transition.
- MUST animate global visual transition with shockwave, theme update, and timeline progress.
- MUST show a 3-5 frame story overlay for each newly reached era.
- MUST allow story skip and replay from the timeline.
- SHOULD seed story facts that quiz questions can reuse later.
</requirements>

## Subtasks
- [x] 7.1 Replace awaiting-era-transition state with merge-driven transition state.
- [x] 7.2 Convert `EraCard` or add story overlay for multi-frame era stories.
- [x] 7.3 Add transition effects for shockwave, screen sweep, theme, and timeline progress.
- [x] 7.4 Add timeline replay entry point for already seen stories.
- [x] 7.5 Ensure transition never clears grid or requires quiz success.
- [x] 7.6 Add tests for automatic transition and story controls.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: final art frames and exact animation choreography are not provided. Use current modal/canvas/theme infrastructure for prototype fidelity, keeping story frame data centralized so art can be swapped later.

### Relevant Files
- `scripts/game/GameEngine.js` — Current `queueEraTransition()`, `showEraTransitionQuiz()`, and `handleQuizSuccess()` implement v1 flow.
- `scripts/ui/EraCard.js` — Current educational card can be refactored or replaced by story sequence.
- `scripts/ui/Timeline.js` — Needs story replay affordance for unlocked eras.
- `scripts/input/DragDrop.js` — Provides merge event and shockwave coordinates.
- `scripts/render/Renderer.js` — Already supports shockwaves.
- `css/animations.css` — Existing animation classes can host sweep/glitch/fade transitions.
- `game.html` — Modal markup for era/story overlay may need changes.

### Dependent Files
- `scripts/ui/QuizSystem.js` — Quiz must stop acting as transition gate.
- `scripts/audio/SoundManager.js` — Era transition cues and story sound hooks may use existing sounds.
- `styles/menu.css` — Story overlay layout and controls.

## Deliverables
- New-era merge opens automatic transition and story.
- Quiz no longer gates progression.
- Story overlay supports next, auto/progress state if chosen, skip, and replay.
- Timeline advances with unlocked trail.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for merge-to-story flow **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Creating level 4 returns transition target era 2.
  - [x] Creating level 5 does not trigger new-era transition.
  - [x] Story data for each era contains at least 3 frames and at most 5 frames.
  - [x] Skipping a story marks that era story as seen.
  - [x] Replaying a seen story does not mutate grid state.
- Integration tests:
  - [x] Browser-driven level 3 merge opens era 2 story without showing quiz modal.
  - [x] Grid still contains the merged level 4 item after closing story.
  - [x] Clicking unlocked timeline era reopens its story.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- No "Avançar para Próxima Era" button is required for era progress.
- Era story appears as part of transition flow.
