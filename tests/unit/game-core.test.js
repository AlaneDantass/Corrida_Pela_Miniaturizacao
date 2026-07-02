import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  COMPONENTS_DATA,
  ERA_START_LEVELS,
  OFFLINE_EARNINGS_CAP_HOURS,
  MAX_GLOBAL_LEVEL,
  getAdaptivePurchaseLevel,
  getComponentByLevel,
  getComponentProduction,
  getComponentRangeForEra,
  getComponentsForEra,
  getEraByGlobalLevel,
  getEraLevelForGlobalLevel,
  getLocalItemByGlobalLevel
} from '../../scripts/config.js';
import { Computer } from '../../scripts/game/Computer.js';
import { Economy } from '../../scripts/game/Economy.js';
import { Grid } from '../../scripts/game/Grid.js';
import { LOCAL_STORAGE_KEY, SAVE_VERSION, SaveManager } from '../../scripts/storage/SaveManager.js';

function createTestLocalStorage(initial = {}) {
  const store = new Map(Object.entries({ game_muted: 'true', ...initial }));

  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => {
      store.clear();
      store.set('game_muted', 'true');
    }
  };
}

if (!globalThis.localStorage) {
  globalThis.localStorage = createTestLocalStorage();
}

const { MergeSystem } = await import('../../scripts/game/MergeSystem.js');
const { audio } = await import('../../scripts/audio/SoundManager.js');

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '../..');

function createGridWithComputers(entries) {
  const grid = new Grid();

  for (const [slot, level] of entries) {
    const coords = grid.getSlotCoordinates(slot);
    grid.placeComputer(new Computer(level, slot, coords.centerX, coords.centerY), slot);
  }

  return grid;
}

test('global component metadata covers the 18-level PRD chain once', () => {
  assert.equal(MAX_GLOBAL_LEVEL, 18);
  assert.equal(COMPONENTS_DATA.length, 18);
  assert.deepEqual(ERA_START_LEVELS, [1, 4, 7, 10, 13, 16]);
  assert.deepEqual(
    COMPONENTS_DATA.map((component) => component.globalLevel),
    Array.from({ length: 18 }, (_, index) => index + 1)
  );
  assert.equal(new Set(COMPONENTS_DATA.map((component) => component.name)).size, 18);
});

test('global level helpers map boundary components to era and local item data', () => {
  const level1 = getComponentByLevel(1);
  assert.equal(level1.name, 'Engrenagens');
  assert.equal(level1.eraLevel, 1);
  assert.equal(level1.localItemIndex, 1);

  const level4 = getComponentByLevel(4);
  assert.equal(level4.name, 'Válvula a Vácuo');
  assert.equal(level4.eraLevel, 2);
  assert.equal(level4.localItemIndex, 1);

  const level18 = getComponentByLevel(18);
  assert.equal(level18.name, 'Computador Quântico');
  assert.equal(level18.eraLevel, 6);
  assert.equal(level18.localItemIndex, 3);

  assert.equal(getComponentByLevel(0), null);
  assert.equal(getEraLevelForGlobalLevel(0), null);
  assert.equal(getEraByGlobalLevel(18).level, 6);
  assert.equal(getLocalItemByGlobalLevel(4).name, 'Válvula a Vácuo');
});

test('era component ranges expose stable global levels', () => {
  assert.deepEqual(getComponentRangeForEra(1), {
    eraLevel: 1,
    start: 1,
    end: 3,
    levels: [1, 2, 3]
  });
  assert.deepEqual(getComponentRangeForEra(6), {
    eraLevel: 6,
    start: 16,
    end: 18,
    levels: [16, 17, 18]
  });
  assert.deepEqual(getComponentsForEra(6).map((component) => component.globalLevel), [16, 17, 18]);
  assert.equal(getComponentRangeForEra(0), null);
});

test('Computer reads era and component data from global level metadata', () => {
  const computer = new Computer(4, 0);

  assert.equal(computer.getComponentData().name, 'Válvula a Vácuo');
  assert.equal(computer.getEraData().level, 2);
});

test('MergeSystem merges equal global levels across eras', () => {
  const grid = createGridWithComputers([[0, 3], [1, 3]]);

  const result = MergeSystem.handleDrop(grid, new Economy(), 0, 1, new Set([1]));

  assert.equal(result.success, true);
  assert.equal(result.action, 'merge');
  assert.equal(result.level, 4);
  assert.equal(result.component.name, 'Válvula a Vácuo');
  assert.equal(result.isNewComponent, true);
  assert.equal(result.isNewEra, true);
  assert.equal(result.newEraLevel, 2);
  assert.equal(result.isFinalComponent, false);
  assert.equal(grid.getComputer(0), null);
  assert.equal(grid.getComputer(1).level, 4);
});

test('MergeSystem emits final component flag at level 18 and rejects above max', () => {
  const finalGrid = createGridWithComputers([[0, 17], [1, 17]]);

  const finalResult = MergeSystem.handleDrop(finalGrid, new Economy(), 0, 1, new Set([1, 2, 3, 4, 5, 6]));

  assert.equal(finalResult.success, true);
  assert.equal(finalResult.level, 18);
  assert.equal(finalResult.isFinalComponent, true);
  assert.equal(finalResult.isFinalItem, true);
  assert.equal(finalGrid.getComputer(1).level, 18);

  const maxGrid = createGridWithComputers([[0, 18], [1, 18]]);
  const maxResult = MergeSystem.handleDrop(maxGrid, new Economy(), 0, 1, new Set([1, 2, 3, 4, 5, 6]));

  assert.equal(maxResult.success, false);
  assert.equal(maxResult.action, 'max_level');
  assert.equal(maxGrid.getComputer(0).level, 18);
  assert.equal(maxGrid.getComputer(1).level, 18);
});

test('MergeSystem rejects different global levels and preserves empty-slot movement', () => {
  const rejectGrid = createGridWithComputers([[0, 4], [1, 5]]);

  const rejectResult = MergeSystem.handleDrop(rejectGrid, new Economy(), 0, 1, new Set([1, 2]));

  assert.equal(rejectResult.success, false);
  assert.equal(rejectResult.action, 'reject');
  assert.equal(rejectGrid.getComputer(0).level, 4);
  assert.equal(rejectGrid.getComputer(1).level, 5);

  const moveGrid = createGridWithComputers([[0, 4]]);
  const moveResult = MergeSystem.handleDrop(moveGrid, new Economy(), 0, 2, new Set([1, 2]));

  assert.equal(moveResult.success, true);
  assert.equal(moveResult.action, 'move');
  assert.equal(moveGrid.getComputer(0), null);
  assert.equal(moveGrid.getComputer(2).level, 4);
});

test('adaptive purchase level follows discovered era base without exceeding progression', () => {
  assert.equal(getAdaptivePurchaseLevel(1), 1);
  assert.equal(getAdaptivePurchaseLevel(3), 1);
  assert.equal(getAdaptivePurchaseLevel(4), 4);
  assert.equal(getAdaptivePurchaseLevel(6), 4);
  assert.equal(getAdaptivePurchaseLevel(7), 7);
  assert.equal(getAdaptivePurchaseLevel(18), 16);
  assert.equal(getAdaptivePurchaseLevel(99), 16);
  assert.equal(getAdaptivePurchaseLevel(0), 1);
});

test('SoundManager muted path toggles and skips effect playback without browser audio', () => {
  let persistedMute = null;
  const paused = { value: false };

  globalThis.localStorage.setItem = (key, value) => {
    if (key === 'game_muted') persistedMute = value;
  };

  audio.muted = false;
  audio.bgmPlaying = true;
  audio.bgmAudio = {
    pause() {
      paused.value = true;
    }
  };

  assert.equal(audio.toggleMute(), true);
  assert.equal(audio.isMuted(), true);
  assert.equal(persistedMute, 'true');
  assert.equal(paused.value, true);

  audio.playClick();
  audio.playBuy();
  audio.playMerge();
  audio.playUnlock();
  audio.playError();
  audio.playTick();
});

test('all global component sprite references point to existing assets', () => {
  for (const component of COMPONENTS_DATA) {
    assert.ok(
      existsSync(resolve(projectRoot, component.spritePath)),
      `${component.name} sprite missing: ${component.spritePath}`
    );
  }
});

test('Grid initializes exactly 12 slots for a 3x4 board', () => {
  const grid = new Grid();

  assert.equal(grid.slots.length, 12);
  assert.equal(grid.width, 480);
  assert.equal(grid.height, 640);
  assert.deepEqual(grid.getFreeSlots(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
});

test('Grid.getSlotAt returns -1 for coordinates outside the canvas bounds', () => {
  const grid = new Grid();

  assert.equal(grid.getSlotAt(-1, 0), -1);
  assert.equal(grid.getSlotAt(0, -1), -1);
  assert.equal(grid.getSlotAt(grid.width + 1, 0), -1);
  assert.equal(grid.getSlotAt(0, grid.height + 1), -1);
  assert.equal(grid.getSlotAt(grid.width, 0), -1);
  assert.equal(grid.getSlotAt(0, grid.height), -1);
});

test('Grid maps valid coordinates, slot coordinates, and occupancy state', () => {
  const grid = new Grid();
  const computer = {
    slotIndex: -1,
    target: null,
    setTargetPosition(x, y) {
      this.target = { x, y };
    }
  };

  assert.equal(grid.getSlotAt(0, 0), 0);
  assert.equal(grid.getSlotAt(159, 159), 0);
  assert.equal(grid.getSlotAt(160, 0), 1);
  assert.deepEqual(grid.getSlotCoordinates(4), {
    x: 160,
    y: 160,
    width: 160,
    height: 160,
    centerX: 240,
    centerY: 240
  });
  assert.equal(grid.getSlotCoordinates(-1), null);
  assert.equal(grid.getSlotCoordinates(12), null);

  assert.equal(grid.placeComputer(computer, 4), true);
  assert.equal(computer.slotIndex, 4);
  assert.deepEqual(computer.target, { x: 240, y: 240 });
  assert.equal(grid.getComputer(4), computer);
  assert.equal(grid.getOccupiedCount(), 1);
  assert.equal(grid.isFull(), false);
  assert.equal(grid.placeComputer(computer, 12), false);
  assert.equal(grid.removeComputer(4), computer);
  assert.equal(grid.removeComputer(12), null);
  assert.equal(grid.getOccupiedCount(), 0);
});

test('Grid detects a full board and can clear it', () => {
  const grid = new Grid();

  for (let index = 0; index < grid.slots.length; index++) {
    grid.placeComputer({ setTargetPosition() {} }, index);
  }

  assert.equal(grid.isFull(), true);
  assert.equal(grid.getRandomFreeSlot(), -1);

  grid.clear();

  assert.equal(grid.isFull(), false);
  assert.equal(grid.getOccupiedCount(), 0);
});

test('Economy.getBuyCost returns 10 before purchases and applies 1.15 inflation after purchases', () => {
  const economy = new Economy();

  assert.equal(economy.getBuyCost(), 10);
  assert.equal(economy.canAffordBuy(), false);
  assert.equal(economy.buy(), false);

  economy.coins = 10;

  assert.equal(economy.buy(), true);
  assert.equal(economy.coins, 0);
  assert.equal(economy.totalPurchases, 1);
  assert.equal(economy.getBuyCost(), 11);
});

test('Economy handles click value, prestige, and coin mutations', () => {
  const economy = new Economy({ coins: 5, totalCoinsEarned: 5, totalPurchases: 2, prestigeCount: 1 });

  assert.equal(economy.getPrestigeMultiplier(), 1.5);
  assert.equal(economy.getClickValue(3), 7);
  assert.equal(economy.clickResearch(3), 7);
  assert.equal(economy.coins, 12);
  assert.equal(economy.totalCoinsEarned, 12);

  economy.addCoins(-20);
  assert.equal(economy.coins, 12);

  economy.subtractCoins(50);
  assert.equal(economy.coins, 0);

  assert.equal(economy.calculateCps(new Grid()), 0);

  economy.prestige();
  assert.equal(economy.prestigeCount, 2);
  assert.equal(economy.coins, 0);
  assert.equal(economy.totalPurchases, 0);
});

test('Economy calculates PP/s from global levels and prestige multiplier', () => {
  const emptyGrid = new Grid();
  const level1Grid = createGridWithComputers([[0, 1]]);
  const prestigeEconomy = new Economy({ coins: 0, totalCoinsEarned: 0, totalPurchases: 0, prestigeCount: 2 });
  const baseProduction = getComponentProduction(1);

  assert.equal(new Economy().calculateCps(emptyGrid), 0);
  assert.equal(baseProduction, 1);
  assert.equal(new Economy().calculateCps(level1Grid), baseProduction);
  assert.equal(prestigeEconomy.getPrestigeMultiplier(), 2);
  assert.equal(prestigeEconomy.getClickValue(1), 2);
  assert.equal(prestigeEconomy.calculateCps(level1Grid), baseProduction * 2);
});

test('SaveManager saves and loads version 2 progression fields', () => {
  globalThis.localStorage = createTestLocalStorage();
  const grid = createGridWithComputers([[0, 4]]);

  SaveManager.save({
    coins: 42,
    totalCoinsEarned: 200,
    totalPurchases: 3,
    maxEraUnlocked: 2,
    maxGlobalLevel: 4,
    erasDiscovered: new Set([1, 2]),
    discoveredComponents: new Set([1, 2, 3, 4]),
    prestigeCount: 1,
    tutorialCompleted: true,
    bugzeState: { unlocked: true, active: false },
    grid: grid.slots
  });

  const raw = JSON.parse(globalThis.localStorage.getItem(LOCAL_STORAGE_KEY));
  assert.equal(raw.version, SAVE_VERSION);
  assert.deepEqual(raw.grid, [{ slot: 0, level: 4 }]);
  assert.deepEqual(raw.discoveredComponents, [1, 2, 3, 4]);
  assert.equal(raw.maxGlobalLevel, 4);
  assert.equal(raw.bugzeState.unlocked, true);

  const loaded = SaveManager.load();
  assert.equal(loaded.version, SAVE_VERSION);
  assert.equal(loaded.coins, 42);
  assert.deepEqual(loaded.grid, [{ slot: 0, level: 4 }]);
  assert.deepEqual(Array.from(loaded.erasDiscovered), [1, 2]);
  assert.deepEqual(Array.from(loaded.discoveredComponents), [1, 2, 3, 4]);
  assert.equal(loaded.tutorialCompleted, true);
});

test('SaveManager migrates version 1 slot-level grid data without throwing', () => {
  globalThis.localStorage = createTestLocalStorage({
    [LOCAL_STORAGE_KEY]: JSON.stringify({
      version: 1,
      coins: 7,
      totalCoinsEarned: 9,
      totalPurchases: 0,
      maxEraUnlocked: 1,
      erasDiscovered: [1],
      grid: [{ slot: 0, level: 4 }],
      prestigeCount: 0,
      tutorialCompleted: false,
      lastSaveTime: Date.now()
    })
  });

  const loaded = SaveManager.load();

  assert.equal(loaded.version, SAVE_VERSION);
  assert.equal(loaded.coins, 7);
  assert.deepEqual(loaded.grid, [{ slot: 0, level: 4 }]);
  assert.equal(loaded.maxGlobalLevel, 4);
  assert.deepEqual(Array.from(loaded.erasDiscovered), [1, 2]);
});

test('SaveManager caps offline earnings and uses global production rules', () => {
  const capSeconds = OFFLINE_EARNINGS_CAP_HOURS * 60 * 60;
  const saved = {
    version: SAVE_VERSION,
    coins: 0,
    totalCoinsEarned: 0,
    totalPurchases: 0,
    maxEraUnlocked: 1,
    maxGlobalLevel: 1,
    erasDiscovered: [1],
    discoveredComponents: [1],
    grid: [{ slot: 0, level: 1 }],
    prestigeCount: 2,
    tutorialCompleted: true,
    lastSaveTime: Date.now() - ((OFFLINE_EARNINGS_CAP_HOURS + 3) * 60 * 60 * 1000)
  };

  const offline = SaveManager.calculateOfflineEarnings(saved);

  assert.equal(offline.elapsedSeconds, capSeconds);
  assert.equal(offline.earnings, capSeconds * getComponentProduction(1) * 2);
});

test('unit test command exits non-zero when a known assertion fails', () => {
  const fixturePath = resolve(__dirname, '../fixtures/failing-assertion.test.js');
  const childEnv = { ...process.env };

  for (const key of Object.keys(childEnv)) {
    if (key.startsWith('NODE_TEST')) {
      delete childEnv[key];
    }
  }

  const result = spawnSync(process.execPath, ['--test', fixturePath], {
    encoding: 'utf8',
    env: childEnv
  });

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /intentional assertion failure/);
});
