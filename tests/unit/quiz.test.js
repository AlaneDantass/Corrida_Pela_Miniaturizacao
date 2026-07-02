import assert from 'node:assert/strict';
import test from 'node:test';

import { getEra } from '../../scripts/config.js';
import {
  QUIZ_BASE_REWARD,
  QUIZ_FIRST_TRY_BONUS,
  QuizScheduler
} from '../../scripts/game/QuizScheduler.js';

const ERA1_CORRECT = getEra(1).quiz.correct;
const ERA1_WRONG = ERA1_CORRECT === 0 ? 1 : 0;

test('scheduler returns no question before any story is seen', () => {
  const scheduler = new QuizScheduler();

  assert.equal(scheduler.hasEligibleStory(), false);
  assert.equal(scheduler.selectQuestion(), null);

  // Merges/time cannot raise an invite while nothing is eligible.
  for (let i = 0; i < 20; i++) scheduler.notifyMerge();
  scheduler.tick(9999);
  assert.equal(scheduler.isInvitePending(), false);
});

test('scheduler can select an era 1 question after era 1 story is seen', () => {
  const scheduler = new QuizScheduler();
  scheduler.markSeen(1);

  const question = scheduler.selectQuestion();
  assert.ok(question);
  assert.equal(question.eraLevel, 1);
  assert.equal(question.options.length, 4);
  assert.equal(question.question, getEra(1).quiz.question);
});

test('correct first-try answer awards base reward plus first-try bonus', () => {
  const scheduler = new QuizScheduler();
  scheduler.markSeen(1);

  const result = scheduler.recordAnswer(1, ERA1_CORRECT, 1);
  assert.equal(result.correct, true);
  assert.equal(result.firstTry, true);
  assert.equal(result.reward, QUIZ_BASE_REWARD * 1 + QUIZ_FIRST_TRY_BONUS);
});

test('reward scales by era and prestige; second correct try drops the first-try bonus', () => {
  const scheduler = new QuizScheduler();
  scheduler.markSeen(3);

  // Era 3, prestige x2: base * era * prestige, plus first-try bonus * prestige.
  const first = scheduler.recordAnswer(3, getEra(3).quiz.correct, 2);
  assert.equal(first.reward, QUIZ_BASE_REWARD * 3 * 2 + QUIZ_FIRST_TRY_BONUS * 2);

  const second = scheduler.recordAnswer(3, getEra(3).quiz.correct, 2);
  assert.equal(second.firstTry, false);
  assert.equal(second.reward, QUIZ_BASE_REWARD * 3 * 2);
});

test('incorrect answer awards 0 PP and marks the question for retry', () => {
  const scheduler = new QuizScheduler();
  scheduler.markSeen(1);

  const wrong = scheduler.recordAnswer(1, ERA1_WRONG, 1);
  assert.equal(wrong.correct, false);
  assert.equal(wrong.reward, 0);

  // Rescheduled: the same era is offered again.
  assert.equal(scheduler.selectQuestion().eraLevel, 1);

  // A later correct answer pays base only (no first-try bonus after a miss).
  const later = scheduler.recordAnswer(1, ERA1_CORRECT, 1);
  assert.equal(later.correct, true);
  assert.equal(later.firstTry, false);
  assert.equal(later.reward, QUIZ_BASE_REWARD * 1);
});

test('ignoring an invite does not pause anything and reschedules', () => {
  const scheduler = new QuizScheduler({ mergeCadence: 5 });
  scheduler.markSeen(1);

  // The scheduler owns no pause/lock state — ignoring can never block the game.
  assert.equal(scheduler.isPaused, undefined);

  for (let i = 0; i < 5; i++) scheduler.notifyMerge();
  assert.equal(scheduler.isInvitePending(), true);

  scheduler.dismissInvite();
  assert.equal(scheduler.isInvitePending(), false);

  // Missed invite comes back after the next eligible cadence.
  for (let i = 0; i < 5; i++) scheduler.notifyMerge();
  assert.equal(scheduler.isInvitePending(), true);
});

test('time cadence raises an invite only when a story is eligible', () => {
  const scheduler = new QuizScheduler({ timeCadence: 30 });
  scheduler.tick(60);
  assert.equal(scheduler.isInvitePending(), false); // nothing seen yet

  scheduler.markSeen(1);
  scheduler.tick(60);
  assert.equal(scheduler.isInvitePending(), true);
});
