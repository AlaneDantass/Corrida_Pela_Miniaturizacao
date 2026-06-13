/* 🖥️ js/main.js */

import { GameEngine } from './game/GameEngine.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log("Initializing Computer Evolution Game Engine...");
  
  // Create and launch the engine instance
  window.gameEngine = new GameEngine();
});
