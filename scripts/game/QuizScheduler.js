/* 🎯 js/game/QuizScheduler.js — non-blocking quiz reward scheduler (no DOM) */

import { getEra } from '../config.js';

// Prototype calibration — reward and cadence constants live here so tuning is
// centralized (no _techspec provided exact values).
export const QUIZ_MERGE_CADENCE = 5;   // eligible invite after this many merges
export const QUIZ_TIME_CADENCE = 90;   // ...or this many seconds of play
export const QUIZ_BASE_REWARD = 25;    // base PP per correct answer, times era level
export const QUIZ_FIRST_TRY_BONUS = 25; // extra PP for answering an era right first try

/**
 * Decides when a non-blocking quiz invite is available, which era to ask about
 * (only eras whose stories were seen), and how much PP a correct answer pays.
 * Holds no DOM and no pause/lock state — ignoring an invite can never block the
 * game.
 */
export class QuizScheduler {
  constructor(options = {}) {
    this.seenEras = new Set();
    this.attemptedEras = new Set(); // answered at least once → no more first-try bonus
    this.retryQueue = new Set();    // eras answered wrong / to re-ask
    this.mergeCount = 0;
    this.elapsed = 0;
    this.invitePending = false;

    this.mergeCadence = options.mergeCadence ?? QUIZ_MERGE_CADENCE;
    this.timeCadence = options.timeCadence ?? QUIZ_TIME_CADENCE;
    this.baseReward = options.baseReward ?? QUIZ_BASE_REWARD;
    this.firstTryBonus = options.firstTryBonus ?? QUIZ_FIRST_TRY_BONUS;
  }

  markSeen(eraLevel) {
    if (getEra(eraLevel)?.quiz) this.seenEras.add(eraLevel);
  }

  setSeenEras(eras) {
    this.seenEras = new Set();
    if (eras) {
      for (const era of eras) this.markSeen(era);
    }
  }

  hasEligibleStory() {
    return this.seenEras.size > 0;
  }

  /** A merge happened; may make an invite eligible. */
  notifyMerge() {
    this.mergeCount += 1;
    if (this.mergeCount >= this.mergeCadence && this.hasEligibleStory()) {
      this.invitePending = true;
      this.mergeCount = 0;
    }
  }

  /** Elapsed play time; may make an invite eligible. */
  tick(dtSeconds) {
    if (!(dtSeconds > 0)) return;
    this.elapsed += dtSeconds;
    if (this.elapsed >= this.timeCadence && this.hasEligibleStory()) {
      this.invitePending = true;
      this.elapsed = 0;
    }
  }

  isInvitePending() {
    return this.invitePending && this.hasEligibleStory();
  }

  /** Ignoring an invite: hide it but keep counters so it re-triggers later. */
  dismissInvite() {
    this.invitePending = false;
  }

  /**
   * Picks a question from a seen era, preferring rescheduled (previously wrong)
   * eras. Returns null when no story has been seen yet.
   */
  selectQuestion() {
    if (!this.hasEligibleStory()) return null;

    const retryable = [...this.retryQueue].filter((era) => this.seenEras.has(era));
    const pool = retryable.length > 0 ? retryable : [...this.seenEras];
    const eraLevel = pool[0];
    const era = getEra(eraLevel);
    if (!era?.quiz) return null;

    return {
      eraLevel,
      question: era.quiz.question,
      options: era.quiz.options,
      correct: era.quiz.correct
    };
  }

  /**
   * Records an answer and returns the reward outcome. Wrong answers pay 0 PP,
   * never penalize, and reschedule the era. Correct answers pay base * era,
   * plus a first-try bonus, scaled by prestige.
   * @param {number} eraLevel
   * @param {number} selectedIndex
   * @param {number} [prestigeMultiplier=1]
   */
  recordAnswer(eraLevel, selectedIndex, prestigeMultiplier = 1) {
    const era = getEra(eraLevel);
    this.invitePending = false;
    if (!era?.quiz) return { correct: false, reward: 0, firstTry: false };

    const correct = selectedIndex === era.quiz.correct;
    const firstTry = !this.attemptedEras.has(eraLevel);
    this.attemptedEras.add(eraLevel);

    if (!correct) {
      this.retryQueue.add(eraLevel); // reschedule for later, no penalty
      return { correct: false, reward: 0, firstTry: false };
    }

    this.retryQueue.delete(eraLevel);
    const multiplier = Math.max(0, prestigeMultiplier || 0);
    let reward = Math.round(this.baseReward * eraLevel * multiplier);
    if (firstTry) reward += Math.round(this.firstTryBonus * multiplier);

    return { correct: true, reward, firstTry };
  }
}
