import { expect, test } from '@playwright/test';

const LOCAL_STORAGE_KEY = 'computer_evolution_save';

async function openFreshGame(page) {
  await page.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('game_muted', 'true');
  });

  await page.goto('/game.html', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Boolean(window.gameEngine))).toBe(true);
}

function createVersion2Save(overrides = {}) {
  return {
    version: 2,
    coins: 42,
    totalCoinsEarned: 120,
    totalPurchases: 3,
    maxEraUnlocked: 2,
    maxGlobalLevel: 4,
    unlockedEras: [1, 2],
    erasDiscovered: [1, 2],
    discoveredComponents: [1, 2, 3, 4],
    collection: { discoveredComponents: [1, 2, 3, 4] },
    grid: [{ slot: 0, level: 4 }],
    prestigeCount: 0,
    tutorialCompleted: true,
    tutorialFlags: { completed: true, tourCompleted: true },
    bugzeState: {
      unlocked: false,
      active: false,
      firstInvasionSeen: false,
      lastInvasionAt: null,
      lastResolvedAt: null
    },
    lastSaveTime: Date.now(),
    ...overrides
  };
}

async function openGameWithSave(page, saveData) {
  await page.addInitScript(({ key, data }) => {
    localStorage.clear();
    localStorage.setItem('game_muted', 'true');
    localStorage.setItem(key, JSON.stringify({ ...data, lastSaveTime: Date.now() }));
  }, { key: LOCAL_STORAGE_KEY, data: saveData });

  await page.goto('/game.html', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => Boolean(window.gameEngine))).toBe(true);
  await page.locator('#btn-intro-skip').click();
  await expect(page.locator('#intro-container')).toHaveCount(0);
}

async function setGridLevels(page, entries) {
  await page.evaluate(async (gridEntries) => {
    const { Computer } = await import('/scripts/game/Computer.js');
    const engine = window.gameEngine;

    document.querySelectorAll('.modal-overlay').forEach((element) => {
      element.style.display = 'none';
    });
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    if (tutorialOverlay) tutorialOverlay.style.display = 'none';
    document.body.classList.remove('tutorial-active', 'tutorial-locked');

    engine.grid.clear();
    engine.state.maxEraUnlocked = 1;
    engine.state.erasDiscovered = new Set([1]);
    engine.state.isPaused = false;
    engine.state.tutorialCompleted = true;
    engine.state.isAwaitingEraTransition = false;
    engine.state.victoryTriggered = false;
    engine.economy.coins = 1000;

    for (const [slot, level] of gridEntries) {
      const coords = engine.grid.getSlotCoordinates(slot);
      const computer = new Computer(level, slot, coords.centerX, coords.centerY);
      computer.scale = 1;
      computer.isSpawning = false;
      engine.grid.placeComputer(computer, slot);
    }

    engine.updateTheme();
    engine.hud.update(engine.economy, engine.grid, engine.state.maxEraUnlocked, engine.state);
  }, entries);
}

test('game.html loads over HTTP and mounts core UI without module errors', async ({ page }) => {
  const runtimeErrors = [];

  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') {
      runtimeErrors.push(message.text());
    }
  });

  await openFreshGame(page);

  for (const selector of [
    '#game-canvas',
    '#btn-research',
    '#btn-buy',
    '#timeline-list',
    '#modal-load-save'
  ]) {
    await expect(page.locator(selector)).toHaveCount(1);
  }

  await page.waitForTimeout(500);

  await expect(page.locator('body')).toHaveClass(/era-1/);
  await expect(page.locator('#btn-buy')).toContainText('COMPRAR Engrenagens (N1)');

  expect(runtimeErrors).toEqual([]);
});

test('cross-era canvas merge creates level 4 without clearing existing grid items', async ({ page }) => {
  await openFreshGame(page);
  await setGridLevels(page, [[0, 3], [1, 3], [5, 2]]);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.dragDrop.draggedComputer = engine.grid.getComputer(0);
    engine.dragDrop.dragStartSlot = 0;
    engine.dragDrop.hoverSlotIndex = 1;
    engine.dragDrop.handleDragEnd(new MouseEvent('mouseup'));
  });

  await expect.poll(() => page.evaluate(() => window.gameEngine.grid.getComputer(1)?.level ?? null)).toBe(4);

  const state = await page.evaluate(() => ({
    levels: window.gameEngine.grid.slots.filter(Boolean).map((computer) => computer.level).sort((a, b) => a - b),
    maxEraUnlocked: window.gameEngine.state.maxEraUnlocked,
    erasDiscovered: Array.from(window.gameEngine.state.erasDiscovered),
    bodyClass: document.body.className,
    buyText: document.getElementById('btn-buy')?.innerText ?? ''
  }));

  expect(state.levels).toEqual([2, 4]);
  expect(state.maxEraUnlocked).toBe(2);
  expect(state.erasDiscovered).toContain(2);
  expect(state.bodyClass).toContain('era-2');
  expect(state.buyText).toContain('COMPRAR Válvula a Vácuo (N4)');
  expect(state.buyText).not.toContain('Avançar para Próxima Era');
});

test('load-save modal shows restored progress and continues saved game', async ({ page }) => {
  await openGameWithSave(page, createVersion2Save());

  await expect(page.locator('#modal-load-save')).toBeVisible();
  await expect(page.locator('#save-era-name')).toContainText('Válvula a Vácuo');
  await expect(page.locator('#save-cycles-value')).toContainText('42 PP');

  await page.locator('#btn-continue-save').click();

  await expect(page.locator('#modal-load-save')).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.gameEngine.grid.getComputer(0)?.level ?? null)).toBe(4);
});

test('saved level 4 reload restores global level 4 rather than era-local level 1', async ({ page }) => {
  await openGameWithSave(page, createVersion2Save({ coins: 64 }));

  await page.locator('#btn-continue-save').click();

  const restored = await page.evaluate(() => ({
    level: window.gameEngine.grid.getComputer(0)?.level ?? null,
    maxGlobalLevel: window.gameEngine.state.maxGlobalLevel,
    maxEraUnlocked: window.gameEngine.state.maxEraUnlocked,
    buyText: document.getElementById('btn-buy')?.innerText ?? ''
  }));

  expect(restored.level).toBe(4);
  expect(restored.maxGlobalLevel).toBe(4);
  expect(restored.maxEraUnlocked).toBe(2);
  expect(restored.buyText).toContain('COMPRAR Válvula a Vácuo (N4)');
});

async function openPlayableGame(page) {
  await openFreshGame(page);

  const skip = page.locator('#btn-intro-skip');
  if (await skip.count()) {
    await skip.click().catch(() => {});
    await expect(page.locator('#intro-container')).toHaveCount(0);
  }

  // Neutralize onboarding overlays so layout landmarks and the research button
  // are interactable regardless of the first-run tour.
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay').forEach((el) => { el.style.display = 'none'; });
    const tutorial = document.getElementById('tutorial-overlay');
    if (tutorial) tutorial.style.display = 'none';
    const bugsy = document.getElementById('bugsy-overlay');
    if (bugsy) bugsy.style.display = 'none';
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    const engine = window.gameEngine;
    if (engine) {
      engine.state.tutorialCompleted = true;
      engine.state.isPaused = false;
    }
  });
}

async function clearOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.modal-overlay').forEach((el) => { el.style.display = 'none'; });
    const intro = document.getElementById('intro-container');
    if (intro) intro.remove();
    const tutorial = document.getElementById('tutorial-overlay');
    if (tutorial) tutorial.style.display = 'none';
    document.body.classList.remove('tutorial-active', 'tutorial-locked');
    const engine = window.gameEngine;
    if (engine) {
      engine.state.isPaused = false;
      engine.state.tutorialCompleted = true;
    }
  });
}

test('desktop layout exposes top timeline, left actions, center grid, and right collection', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  // Top region: PP + six-era timeline live inside the header, not the left column.
  await expect(page.locator('header #currency-value')).toBeVisible();
  await expect(page.locator('header #timeline-list')).toBeVisible();
  await expect(page.locator('header #timeline-list .era-node')).toHaveCount(6);
  await expect(page.locator('.sidebar-left #timeline-list')).toHaveCount(0);

  // Left actions stacked, center grid, right collection.
  await expect(page.locator('.sidebar-left #btn-research')).toBeVisible();
  await expect(page.locator('.sidebar-left #btn-buy')).toBeVisible();
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('.sidebar-right .gallery-container')).toBeVisible();
});

test('mobile layout keeps action buttons and grid reachable without overlap', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await openPlayableGame(page);

  const research = page.locator('#btn-research');
  const buy = page.locator('#btn-buy');
  const canvas = page.locator('#game-canvas');

  await expect(research).toBeVisible();
  await expect(buy).toBeVisible();
  await expect(canvas).toBeVisible();

  const researchBox = await research.boundingBox();
  const buyBox = await buy.boundingBox();
  const canvasBox = await canvas.boundingBox();

  expect(researchBox).not.toBeNull();
  expect(buyBox).not.toBeNull();
  expect(canvasBox).not.toBeNull();

  // Stacked, not overlapping: research button sits fully above the buy button.
  expect(researchBox.y + researchBox.height).toBeLessThanOrEqual(buyBox.y + 1);

  // Controls stay within the mobile viewport (no horizontal overflow/clipping).
  for (const box of [researchBox, buyBox, canvasBox]) {
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x + box.width).toBeLessThanOrEqual(375 + 1);
  }
});

test('clicking Realizar Pesquisa updates PP in the top region', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  // Clear the grid so passive generation cannot move PP — the click must.
  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.grid.clear();
    engine.economy.coins = 0;
    engine.state.maxEraUnlocked = 1;
    engine.hud.update(engine.economy, engine.grid, engine.state.maxEraUnlocked, engine.state);
  });

  const currency = page.locator('header #currency-value');
  await expect(currency).toHaveText('0');

  await page.locator('#btn-research').click();

  await expect.poll(() => page.evaluate(() => window.gameEngine.economy.coins)).toBeGreaterThan(0);
  await expect(currency).not.toHaveText('0');
});

test('collection renders all 18 components grouped by era', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  await expect(page.locator('#gallery-collection .gallery-item')).toHaveCount(18);
  await expect(page.locator('#gallery-collection .gallery-era-header')).toHaveCount(6);

  // No longer only the current-era N1/N2/N3: a level-18 slot exists.
  await expect(page.locator('#gallery-collection .gallery-item[data-level="18"]')).toHaveCount(1);
});

test('clicking locked Computador Quântico does not open discovered detail content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  const lockedItem = page.locator('#gallery-collection .gallery-item[data-level="18"]');
  await expect(lockedItem).toHaveClass(/locked/);
  await expect(lockedItem.locator('.gallery-name')).toHaveText('???');

  await lockedItem.click();

  // Detail panel stays closed for locked components.
  await expect(page.locator('#modal-component')).toBeHidden();
});

test('creating a new global level updates its collection entry to discovered', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFreshGame(page);
  await setGridLevels(page, [[0, 3], [1, 3]]);

  const levelFour = page.locator('#gallery-collection .gallery-item[data-level="4"]');
  await expect(levelFour).toHaveClass(/locked/);

  // Merge the two level-3 items to create global level 4.
  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.dragDrop.draggedComputer = engine.grid.getComputer(0);
    engine.dragDrop.dragStartSlot = 0;
    engine.dragDrop.hoverSlotIndex = 1;
    engine.dragDrop.handleDragEnd(new MouseEvent('mouseup'));
  });

  await expect.poll(() => page.evaluate(() => window.gameEngine.grid.getComputer(1)?.level ?? null)).toBe(4);
  await expect(levelFour).toHaveClass(/discovered/);
  await expect(levelFour.locator('.gallery-name')).toHaveText('Válvula a Vácuo');
});

test('reload after save preserves discovered collection entries', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openGameWithSave(page, createVersion2Save());

  await page.locator('#btn-continue-save').click();

  // Save discovered levels 1-4; those slots come back discovered, later ones locked.
  for (const level of [1, 2, 3, 4]) {
    await expect(page.locator(`#gallery-collection .gallery-item[data-level="${level}"]`)).toHaveClass(/discovered/);
  }
  await expect(page.locator('#gallery-collection .gallery-item[data-level="5"]')).toHaveClass(/locked/);
});

test('level 3 merge opens the era 2 story automatically without a quiz gate', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openFreshGame(page);
  await setGridLevels(page, [[0, 3], [1, 3]]);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.dragDrop.draggedComputer = engine.grid.getComputer(0);
    engine.dragDrop.dragStartSlot = 0;
    engine.dragDrop.hoverSlotIndex = 1;
    engine.dragDrop.handleDragEnd(new MouseEvent('mouseup'));
  });

  // Automatic transition: story appears, quiz stays closed (not a gate).
  await expect(page.locator('#modal-story')).toBeVisible();
  await expect(page.locator('#modal-quiz')).toBeHidden();
  await expect(page.locator('#modal-story .story-frame-indicator')).toContainText('/');
});

test('grid keeps the merged level 4 item after closing the era story', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);
  await setGridLevels(page, [[0, 3], [1, 3]]);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.dragDrop.draggedComputer = engine.grid.getComputer(0);
    engine.dragDrop.dragStartSlot = 0;
    engine.dragDrop.hoverSlotIndex = 1;
    engine.dragDrop.handleDragEnd(new MouseEvent('mouseup'));
  });

  await expect(page.locator('#modal-story')).toBeVisible();

  // Skip through the whole story; grid must retain the created level-4 item.
  for (let i = 0; i < 6; i++) {
    if (!(await page.locator('#modal-story').isVisible())) break;
    await page.locator('#modal-story .btn-story-next').click();
  }

  await expect(page.locator('#modal-story')).toBeHidden();
  const level = await page.evaluate(() => window.gameEngine.grid.getComputer(1)?.level ?? null);
  expect(level).toBe(4);
});

test('clicking an unlocked timeline era reopens its story', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openGameWithSave(page, createVersion2Save());

  await page.locator('#btn-continue-save').click();
  await expect(page.locator('#modal-load-save')).toBeHidden();

  // Dismiss the offline-earnings report so it does not overlap the timeline.
  await clearOverlays(page);

  // Era 2 is unlocked in this save; its timeline node replays the story.
  await expect(page.locator('#timeline-era-2')).toHaveClass(/unlocked-era/);
  await page.locator('#timeline-era-2').click();

  await expect(page.locator('#modal-story')).toBeVisible();
  await expect(page.locator('#modal-story .story-title')).toContainText('Eletrônicos');
});

test('eligible cadence surfaces a non-blocking quiz invite while the grid stays visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.quizScheduler.setSeenEras([1]);
    for (let i = 0; i < 5; i++) engine.quizScheduler.notifyMerge();
  });

  await expect(page.locator('#quiz-invite')).toBeVisible();
  // Non-blocking: the board and action buttons remain usable behind the invite.
  await expect(page.locator('#game-canvas')).toBeVisible();
  await expect(page.locator('#btn-research')).toBeVisible();
  await expect(page.locator('#modal-quiz')).toBeHidden();
});

test('accepting the invite opens the quiz with four options', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.quizScheduler.setSeenEras([1]);
    for (let i = 0; i < 5; i++) engine.quizScheduler.notifyMerge();
  });

  // Wait one frame for the game loop to pick up the scheduler state change
  await page.waitForTimeout(200);

  await expect(page.locator('#quiz-invite')).toBeVisible();
  // quiz-invite has a continuous CSS bob animation — force-click past stability checks
  await page.locator('#quiz-invite').click({ force: true });

  await expect(page.locator('#modal-quiz')).toBeVisible();
  await expect(page.locator('#quiz-options-container button')).toHaveCount(4);
  await expect(page.locator('#quiz-subtitle')).toHaveText('Quiz de Revisão');
});

test('correct answer increases PP and closes the quiz without changing era', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openPlayableGame(page);

  await page.evaluate(() => {
    const engine = window.gameEngine;
    engine.grid.clear();            // no passive PP, so only the reward moves coins
    engine.economy.coins = 0;
    engine.quizScheduler.setSeenEras([1]);
    for (let i = 0; i < 5; i++) engine.quizScheduler.notifyMerge();
  });

  await page.waitForTimeout(200);
  await page.locator('#quiz-invite').click({ force: true });
  await expect(page.locator('#modal-quiz')).toBeVisible();

  const correctIndex = await page.evaluate(() => window.gameEngine.quizSystem.activeQuestion.correct);
  await page.locator('#quiz-options-container button').nth(correctIndex).click();

  await expect.poll(() => page.evaluate(() => window.gameEngine.economy.coins)).toBeGreaterThanOrEqual(50);
  await expect(page.locator('#modal-quiz')).toBeHidden();
  expect(await page.evaluate(() => window.gameEngine.state.maxEraUnlocked)).toBe(1);
});
