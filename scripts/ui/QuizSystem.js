/* 🎛️ js/ui/QuizSystem.js */

import { getEra } from '../config.js';
import { audio } from '../audio/SoundManager.js';

export class QuizSystem {
  constructor(overlayId, callbacks) {
    this.overlay = document.getElementById(overlayId);
    this.callbacks = callbacks || {};
    this.activeEraLevel = 1;
    this.isAnswering = false;

    // Elements
    this.techNameEl = document.getElementById('quiz-tech-name');
    this.techDescEl = document.getElementById('quiz-tech-desc');
    this.questionTextEl = document.getElementById('quiz-question-text');
    this.optionsContainer = document.getElementById('quiz-options-container');
    this.feedbackTextEl = document.getElementById('quiz-feedback-text');
  }

  /**
   * Shows the Quiz modal for a specific era level.
   * @param {number} eraLevel - The era the player just reached the tech limit on.
   */
  show(eraLevel) {
    this.activeEraLevel = eraLevel;
    this.isAnswering = false;
    const era = getEra(eraLevel);
    
    if (!era || !era.quiz) return;

    // Set colors according to the era theme
    document.documentElement.style.setProperty('--accent-primary', era.color);
    document.documentElement.style.setProperty('--glow-color', era.color);

    // Populate Tech Announcement Info Box
    if (this.techNameEl) this.techNameEl.textContent = era.itemN3;
    if (this.techDescEl) this.techDescEl.textContent = era.description;

    // Populate Question Text
    if (this.questionTextEl) this.questionTextEl.textContent = era.quiz.question;

    // Reset feedback
    if (this.feedbackTextEl) {
      this.feedbackTextEl.style.display = 'none';
      this.feedbackTextEl.textContent = '';
    }

    // Build Option Buttons
    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      
      era.quiz.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-quiz-option';
        btn.textContent = option;
        
        // Add click listener
        btn.addEventListener('click', () => this.handleAnswer(index, btn));
        
        this.optionsContainer.appendChild(btn);
      });
    }

    // Display overlay
    this.overlay.style.display = 'block';
    audio.playError(); // Use alert/warning/error sound to signal tech limit reached
  }

  /**
   * Handles user's answer selection.
   * @param {number} selectedIndex - The option index chosen by user
   * @param {HTMLButtonElement} buttonEl - The button element clicked
   */
  handleAnswer(selectedIndex, buttonEl) {
    if (this.isAnswering) return; // Prevent double taps during transition

    const era = getEra(this.activeEraLevel);
    const isCorrect = (selectedIndex === era.quiz.correct);

    if (isCorrect) {
      this.isAnswering = true;
      audio.playUnlock();
      
      // Visual feedback: green highlight
      buttonEl.classList.add('correct');
      
      if (this.feedbackTextEl) {
        this.feedbackTextEl.style.color = '#66BB6A';
        this.feedbackTextEl.style.textShadow = '0 0 8px rgba(102, 187, 106, 0.4)';
        this.feedbackTextEl.textContent = 'Resposta Correta! Você ganhou +15 créditos. Transição de Era Autorizada...';
        this.feedbackTextEl.style.display = 'block';
      }

      // Hide modal after a short delay so the user sees the green feedback
      setTimeout(() => {
        this.hide();
        if (this.callbacks.onSuccess) {
          this.callbacks.onSuccess(this.activeEraLevel);
        }
      }, 1500);
    } else {
      audio.playError();
      
      // Visual feedback: red highlight + wiggle effect
      buttonEl.classList.add('incorrect');
      buttonEl.classList.add('shake');
      
      if (this.feedbackTextEl) {
        this.feedbackTextEl.style.color = '#FF5252';
        this.feedbackTextEl.style.textShadow = '0 0 8px rgba(255, 82, 82, 0.3)';
        this.feedbackTextEl.textContent = 'Resposta Incorreta. Tente novamente!';
        this.feedbackTextEl.style.display = 'block';
      }

      // Remove wiggle class and incorrect class when clicked again or after animation
      setTimeout(() => {
        buttonEl.classList.remove('shake');
      }, 500);
    }
  }

  hide() {
    this.overlay.style.display = 'none';
  }
}
