import assert from 'node:assert/strict';
import test from 'node:test';

import { Collection } from '../../scripts/game/Collection.js';

test('Collection marks level 1 discovered in a new game', () => {
  const collection = new Collection();

  assert.equal(collection.isDiscovered(1), true);
  const entry = collection.getEntry(1);
  assert.equal(entry.discovered, true);
  assert.equal(entry.name, 'Engrenagens');
});

test('marking level 4 discovered does not automatically discover levels 5-18', () => {
  const collection = new Collection();
  collection.markDiscovered(4);

  assert.equal(collection.isDiscovered(4), true);
  for (let level = 5; level <= 18; level++) {
    assert.equal(collection.isDiscovered(level), false, `level ${level} should stay locked`);
    assert.equal(collection.getEntry(level).locked, true);
  }
});

test('locked level 18 returns locked display metadata', () => {
  const collection = new Collection();
  const entry = collection.getEntry(18);

  assert.equal(entry.discovered, false);
  assert.equal(entry.locked, true);
  assert.equal(entry.name, '???');
  assert.equal(entry.description, null);
  assert.equal(entry.spritePath, null);
  // Still grouped so the locked slot renders under its era header.
  assert.equal(entry.eraLevel, 6);
});

test('discovered level 12 returns IBM PC name and era 4', () => {
  const collection = new Collection();
  collection.markDiscovered(12);

  const entry = collection.getEntry(12);
  assert.equal(entry.discovered, true);
  assert.equal(entry.name, 'IBM PC');
  assert.equal(entry.eraLevel, 4);
  assert.equal(entry.description !== null, true);
  assert.ok(entry.spritePath.includes('era4_ibm_pc.png'));
});

test('collection exposes all 18 entries grouped into 6 eras of 3', () => {
  const collection = new Collection();

  const entries = collection.getEntries();
  assert.equal(entries.length, 18);
  assert.deepEqual(entries.map((entry) => entry.globalLevel), Array.from({ length: 18 }, (_, i) => i + 1));

  const groups = collection.getEntriesByEra();
  assert.equal(groups.length, 6);
  assert.deepEqual(groups.map((group) => group.entries.length), [3, 3, 3, 3, 3, 3]);
  assert.equal(groups[3].eraName, 'Revolução do Microprocessador');
});

test('setDiscovered replaces the set authoritatively but always keeps level 1', () => {
  const collection = new Collection([1, 2, 3, 4]);
  assert.equal(collection.isDiscovered(4), true);

  // Simulate a reset: only level 1 remains discovered.
  collection.setDiscovered(new Set([1]));
  assert.equal(collection.isDiscovered(1), true);
  assert.equal(collection.isDiscovered(4), false);
  assert.equal(collection.discoveredCount, 1);
});

test('invalid global levels are ignored and return null entries', () => {
  const collection = new Collection();

  assert.equal(collection.markDiscovered(0), false);
  assert.equal(collection.markDiscovered(19), false);
  assert.equal(collection.markDiscovered('abc'), false);
  assert.equal(collection.getEntry(0), null);
  assert.equal(collection.getEntry(19), null);
});
