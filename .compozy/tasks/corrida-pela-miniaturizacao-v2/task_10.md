---
status: pending
title: "Intro em vídeo, polimento audiovisual e vitória N18"
type: frontend
complexity: medium
dependencies:
  - task_03
  - task_07
  - task_09
---

# Task 10: Intro em vídeo, polimento audiovisual e vitória N18

## Overview
Esta tarefa fecha o fluxo v2 substituindo a intro coreografada por vídeo pulável, alinhando áudio/visual às eras e movendo a vitória para o Computador Quântico de nível 18. Ela mantém Continuar/Recomeçar, Prestígio, Sandbox, mute e reset.

<critical>
- ALWAYS READ the PRD and TechSpec before starting
- REFERENCE TECHSPEC for implementation details — do not duplicate here
- FOCUS ON "WHAT" — describe what needs to be accomplished, not how
- MINIMIZE CODE — show code only to illustrate current structure or problem areas
- TESTS REQUIRED — every task MUST include tests in deliverables
</critical>

<requirements>
- MUST replace code-choreographed intro with a skippable video intro when the video asset is available.
- MUST gracefully fall back to current intro or immediate game start if the video asset is missing.
- MUST keep Continuar/Recomeçar save verification after intro completion or skip.
- MUST trigger victory only when global level 18 is created.
- MUST show victory stats for time, total PP, and prestige cycles.
- MUST preserve Prestígio (+50% per cycle), Sandbox, mute, and reset behavior.
- SHOULD align music, grain, lighting, and theme treatment with era emotional arc.
</requirements>

## Subtasks
- [ ] 10.1 Add video intro container and skip/completion event flow.
- [ ] 10.2 Keep fallback behavior for missing video asset.
- [ ] 10.3 Ensure save modal appears after intro completion/skip.
- [ ] 10.4 Update victory trigger and modal copy for global level 18 Computador Quântico.
- [ ] 10.5 Audit audio/theme transitions for era arc and mute compatibility.
- [ ] 10.6 Add tests for intro skip, save modal ordering, and N18 victory.

## Implementation Details
No `_techspec.md` exists; implementation detail gap: the GDD says the video is already produced, but no video file is currently visible in the repository. Implement the integration point with a clear asset path and fallback so the game remains playable until the video is added.

### Relevant Files
- `game.html` — Current intro DOM is built for code choreography and needs video-capable markup.
- `scripts/intro.js` — Current timeline choreography can become fallback or be bypassed.
- `scripts/game.js` — Boots intro and game engine.
- `scripts/game/GameEngine.js` — Handles introFinished, load-save modal, victory, prestige, and sandbox.
- `scripts/audio/SoundManager.js` — BGM/mute behavior must remain compatible with intro and era changes.
- `styles/intro.css` — Intro overlay styles.
- `styles/menu.css` — Victory modal styles.

### Dependent Files
- `README.md` — Should mention required video asset path after integration.
- `assets/` — Target location for video file if added later.
- `scripts/storage/SaveManager.js` — Save modal ordering depends on load behavior.

## Deliverables
- Video intro path with skip and completion events.
- Fallback path when video asset is missing.
- Save verification still appears after intro.
- Victory triggers at level 18 and shows correct stats/options.
- Unit tests with 80%+ coverage **(REQUIRED)**.
- Integration tests for intro and victory flow **(REQUIRED)**.

## Tests
- Unit tests:
  - [ ] Intro controller emits `introFinished` when skip is clicked.
  - [ ] Missing video asset path falls back without throwing.
  - [ ] Victory condition returns false for level 17 and true for level 18.
  - [ ] Prestige increments multiplier by 50% and resets run state while preserving prestige count.
- Integration tests:
  - [ ] With no save, skipping intro starts a new game with one level 1 item.
  - [ ] With an existing save, skipping intro shows Continuar/Recomeçar before gameplay resumes.
  - [ ] Creating level 18 opens victory modal and hides purchase flow only after victory.
  - [ ] Sandbox closes victory and allows continued interaction.
- Test coverage target: >=80%
- All tests must pass

## Success Criteria
- All tests passing
- Test coverage >=80%
- Intro no longer depends only on 30-second code choreography when video is available.
- Victory condition is tied to Computador Quântico global level 18.
