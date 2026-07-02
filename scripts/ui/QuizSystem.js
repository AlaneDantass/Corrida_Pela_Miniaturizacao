/* 🎛️ js/ui/QuizSystem.js — non-blocking review quiz (reward, not a gate) */

import { getEra } from '../config.js';
import { audio } from '../audio/SoundManager.js';

export class QuizSystem {
  constructor(overlayId, callbacks) {
    this.overlay = document.getElementById(overlayId);
    this.callbacks = callbacks || {};
    this.activeEraLevel = 1;
    this.activeQuestion = null;
    this.isAnswering = false;

    // Elements
    this.subtitleEl = document.getElementById('quiz-subtitle');
    this.titleEl = document.getElementById('quiz-title');
    this.techNameEl = document.getElementById('quiz-tech-name');
    this.techDescEl = document.getElementById('quiz-tech-desc');
    this.questionTextEl = document.getElementById('quiz-question-text');
    this.optionsContainer = document.getElementById('quiz-options-container');
    this.feedbackTextEl = document.getElementById('quiz-feedback-text');
  }

  /**
   * Shows the review quiz for a selected question. Does NOT pause the game —
   * the quiz is a reward opportunity, not a progression gate.
   * @param {{eraLevel:number, question:string, options:string[], correct:number}} question
   */
  show(question) {
    if (!question || !Array.isArray(question.options)) return;

    this.activeQuestion = question;
    this.activeEraLevel = question.eraLevel;
    this.isAnswering = false;
    const era = getEra(question.eraLevel);

    // Theme the modal to the era being reviewed
    if (era) {
      document.documentElement.style.setProperty('--accent-primary', era.color);
      document.documentElement.style.setProperty('--glow-color', era.color);
    }

    if (this.subtitleEl) this.subtitleEl.textContent = 'Quiz de Revisão';
    if (this.titleEl) this.titleEl.textContent = 'Ganhe Pontos de Pesquisa';
    if (this.techNameEl) this.techNameEl.textContent = era?.name ?? '';
    if (this.techDescEl) this.techDescEl.textContent = 'Acerte para ganhar PP. Errar não custa nada.';
    if (this.questionTextEl) this.questionTextEl.textContent = question.question;

    if (this.feedbackTextEl) {
      this.feedbackTextEl.style.display = 'none';
      this.feedbackTextEl.textContent = '';
    }

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => this.handleAnswer(index, btn));
        this.optionsContainer.appendChild(btn);
      });
    }

    this.overlay.style.display = 'block';
    audio.playTick();
  }

  /**
   * Handles an answer. Reward math lives in the scheduler via the onAnswer
   * callback; the view only renders feedback and closes.
   * @param {number} selectedIndex
   * @param {HTMLButtonElement} buttonEl
   */
  handleAnswer(selectedIndex, buttonEl) {
    if (this.isAnswering || !this.activeQuestion) return;
    this.isAnswering = true;

    const isCorrect = selectedIndex === this.activeQuestion.correct;
    const result = this.callbacks.onAnswer
      ? this.callbacks.onAnswer(this.activeEraLevel, selectedIndex)
      : { correct: isCorrect, reward: 0 };

    if (isCorrect) {
      audio.playUnlock();
      buttonEl.classList.add('correct');
      if (this.feedbackTextEl) {
        this.feedbackTextEl.style.color = '#66BB6A';
        this.feedbackTextEl.style.textShadow = '0 0 8px rgba(102, 187, 106, 0.4)';
        this.feedbackTextEl.textContent = `Resposta correta! +${result?.reward ?? 0} PP`;
        this.feedbackTextEl.style.display = 'block';
      }
    } else {
      audio.playError();
      buttonEl.classList.add('incorrect', 'shake');
      if (this.feedbackTextEl) {
        this.feedbackTextEl.style.color = '#FF5252';
        this.feedbackTextEl.style.textShadow = '0 0 8px rgba(255, 82, 82, 0.3)';
        this.feedbackTextEl.textContent = 'Resposta incorreta — sem custo. A pergunta volta depois.';
        this.feedbackTextEl.style.display = 'block';
      }
      setTimeout(() => buttonEl.classList.remove('shake'), 500);
    }

    // Close either way — wrong answers are rescheduled, not retried in place.
    setTimeout(() => {
      this.hide();
      if (this.callbacks.onClose) this.callbacks.onClose(this.activeEraLevel, isCorrect);
    }, 1300);
  }

  hide() {
    this.overlay.style.display = 'none';
  }
}
