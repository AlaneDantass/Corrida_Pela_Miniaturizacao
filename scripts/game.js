/* 🖥️ scripts/game.js */

import { GameEngine } from './game/GameEngine.js';
import { IntroController } from './intro.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log("Initializing Computer Evolution Cinematic Intro...");
  
  // 1. Initialize Cinematic Intro
  const intro = new IntroController();
  intro.init();

  console.log("Initializing Computer Evolution Game Engine...");
  
  // 2. Create and launch the engine instance
  window.gameEngine = new GameEngine();
});
