import './helpers/test-globals.js'; // must run before audio-dependent imports load

import assert from 'node:assert/strict';
import test from 'node:test';

import { getEraTransitionTarget } from '../../scripts/config.js';
import { ERA_STORIES, getEraStory } from '../../scripts/data/EraStories.js';
import { Computer } from '../../scripts/game/Computer.js';
import { Grid } from '../../scripts/game/Grid.js';
import { StorySystem } from '../../scripts/ui/StorySystem.js';
import { createDomStub } from './helpers/dom-stub.js';

function buildStoryDom(stub) {
  const overlay = stub.makeElement('div', 'modal-story');
  for (const cls of ['story-title', 'story-text', 'story-image', 'story-frame-indicator', 'btn-story-next', 'btn-story-skip']) {
    const el = stub.makeElement('div');
    el.classList.add(cls);
    overlay.appendChild(el);
  }
  return overlay;
}

test('creating level 4 returns transition target era 2', () => {
  assert.equal(getEraTransitionTarget(4), 2);
  assert.equal(getEraTransitionTarget(7), 3);
  assert.equal(getEraTransitionTarget(10), 4);
  assert.equal(getEraTransitionTarget(16), 6);
});

test('creating level 5 does not trigger a new-era transition', () => {
  assert.equal(getEraTransitionTarget(5), null);
  assert.equal(getEraTransitionTarget(6), null);
  // Era 1's start level is the initial state, never a transition.
  assert.equal(getEraTransitionTarget(1), null);
  assert.equal(getEraTransitionTarget(0), null);
});

test('each era story contains between 3 and 5 frames', () => {
  assert.equal(ERA_STORIES.length, 6);
  for (let eraLevel = 1; eraLevel <= 6; eraLevel++) {
    const story = getEraStory(eraLevel);
    assert.ok(story, `era ${eraLevel} has a story`);
    assert.ok(
      story.frames.length >= 3 && story.frames.length <= 5,
      `era ${eraLevel} frames must be in [3,5], got ${story.frames.length}`
    );
    for (const frame of story.frames) {
      assert.equal(typeof frame.text, 'string');
      assert.ok(frame.text.length > 0);
    }
  }
  assert.equal(getEraStory(99), null);
});

test('skipping a story marks that era story as seen', () => {
  const stub = createDomStub();
  globalThis.document = stub.document;
  buildStoryDom(stub);

  const story = new StorySystem('modal-story');
  assert.equal(story.hasSeen(2), false);
  assert.equal(story.show(2), true);
  story.skip();
  assert.equal(story.hasSeen(2), true);
});

test('advancing through every frame finishes and closes the story', () => {
  const stub = createDomStub();
  globalThis.document = stub.document;
  const overlay = buildStoryDom(stub);

  const story = new StorySystem('modal-story');
  story.show(3);
  const frameCount = getEraStory(3).frames.length;
  for (let i = 0; i < frameCount; i++) story.next(); // final next() finishes

  assert.equal(story.hasSeen(3), true);
  assert.equal(overlay.style.display, 'none');
});

test('replaying a seen story does not mutate grid state', () => {
  const stub = createDomStub();
  globalThis.document = stub.document;
  buildStoryDom(stub);

  const grid = new Grid();
  const coords = grid.getSlotCoordinates(0);
  grid.placeComputer(new Computer(4, 0, coords.centerX, coords.centerY), 0);
  const occupiedBefore = grid.getOccupiedCount();
  const levelBefore = grid.getComputer(0).level;

  const story = new StorySystem('modal-story');
  story.markSeen(2);
  assert.equal(story.show(2, { replay: true }), true);
  story.skip();

  // StorySystem holds no grid reference; replay is purely presentational.
  assert.equal(grid.getOccupiedCount(), occupiedBefore);
  assert.equal(grid.getComputer(0).level, levelBefore);
});
