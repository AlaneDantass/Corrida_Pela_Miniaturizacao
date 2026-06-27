/* 🎨 scripts/ui.js - Interface Visuals and Audio Hooks */

import { audio } from './audio/SoundManager.js';

// Wait for the DOM to load
window.addEventListener('DOMContentLoaded', () => {
  console.log("Initializing UI Interactions and Audio triggers...");

  // 1. Play subtle audio tick when hovering over interactive elements
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('button, .btn-control, .timeline-item, .gallery-item, .btn-quiz-option');
    if (target && !target.disabled) {
      audio.playTick();
    }
  });

  // 2. Click micro-interactions: quick scale down and instant audio init context
  document.addEventListener('click', (e) => {
    const target = e.target.closest('button, .btn-control, .btn-modal-action, .btn-quiz-option');
    if (target && !target.disabled) {
      // Ensure audio context is ready on first click
      audio.initContext();
      
      // Immediate visual bounce scale feedback
      target.style.transform = 'scale(0.95)';
      target.style.transition = 'transform 0.08s ease';
      
      setTimeout(() => {
        target.style.transform = '';
        target.style.transition = '';
      }, 80);
    }
  });
});
