---
status: completed
title: "Quiz-recompensa contínuo"
type: frontend
complexity: medium
dependencies:
  - task_04
  - task_07
---

# Task 08: Quiz-recompensa contínuo

## Overview
Esta tarefa reaproveita o sistema de quiz como oportunidade de recompensa, não como bloqueio de progressão. Quizzes devem surgir em pausas naturais, revisar historinhas vistas e pagar PP generoso sem punir erro.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST show quiz invitations as non-blocking opportunities after eligible merges or time intervals.
- MUST ask only about eras whose stories have been seen.
- MUST present four answer options per question.
- MUST award PP on correct answers, scaled by era/progress.
- MUST award an extra first-try bonus.
- MUST apply no PP penalty for wrong answers.
- MUST reschedule missed or incorrectly answered questions for later.
</requirements>

## Subtasks
- [x] 8.1 Decouple `QuizSystem` success from era transition callbacks.
- [x] 8.2 Add quiz scheduling state based on merges, elapsed time, and seen stories.
- [x] 8.3 Add reward calculation and first-try bonus through `Economy`.
- [x] 8.4 Add non-blocking invitation UI that the player can accept or ignore.
- [x] 8.5 Add retry/reschedule behavior for wrong or ignored questions.
- [x] 8.6 Add tests for reward, eligibility, and non-blocking behavior.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: exact reward values and quiz cadence are not specified. Use configurable constants and document prototype calibration assumptions near the scheduler or config.

### Relevant Files
- `scripts/ui/QuizSystem.js` — Current modal enforces transition success and retry-in-place behavior.
- `scripts/game/GameEngine.js` — Owns update loop, merge callbacks, pause state, and quiz wiring.
- `scripts/game/Economy.js` — Needs reward deposit path that updates totals.
- `scripts/config.js` — Existing era quiz data can seed the first question set.
- `game.html` — Existing quiz modal may need subtitle/body changes and invitation UI.
- `styles/menu.css` — Existing quiz option styles can be reused.

### Dependent Files
- `scripts/ui/EraCard.js` or story module — Quiz eligibility depends on seen stories.
- `scripts/storage/SaveManager.js` — Scheduler state may need persistence if quizzes survive reload.
- `scripts/ui/HUD.js` — PP reward should update visible counters immediately.

## Deliverables
- Quiz no longer blocks era progress.
- Non-blocking quiz invite appears only when eligible story content exists.
- Correct answers award PP and first-try bonus.
- Wrong answers do not remove PP and are rescheduled.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for quiz invitation and reward flow **(REQUIRED)**.

## Tests
- Unit tests:
  - [x] Quiz scheduler returns no question before any story is seen.
  - [x] Scheduler can select an era 1 question after era 1 story is seen.
  - [x] Correct first-try answer awards base reward plus first-try bonus.
  - [x] Incorrect answer awards `0` PP and marks the question for retry.
  - [x] Ignored invitation does not pause grid interactions.
- Integration tests:
  - [x] After eligible merge cadence, quiz invite appears while the grid remains visible.
  - [x] Accepting invite opens quiz modal with four options.
  - [x] Correct answer increases PP and closes modal without changing era.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Quiz copy no longer says "Transição de Era Autorizada".
- Player can ignore quiz without blocking merge, buy, or research actions.
