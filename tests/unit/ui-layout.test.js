import assert from 'node:assert/strict';
import test from 'node:test';

import { ERAS_DATA } from '../../scripts/config.js';
import { Computer } from '../../scripts/game/Computer.js';
import { Economy } from '../../scripts/game/Economy.js';
import { Grid } from '../../scripts/game/Grid.js';
import { HUD } from '../../scripts/ui/HUD.js';
import { Timeline } from '../../scripts/ui/Timeline.js';
import { createDomStub } from './helpers/dom-stub.js';

function installDom() {
  const stub = createDomStub();
  globalThis.document = stub.document;
  return stub;
}

/** Builds the top-bar / action DOM nodes the HUD selects by id. */
function buildHudDom(stub) {
  stub.makeElement('span', 'currency-value');
  stub.makeElement('span', 'cps-value');
  stub.makeElement('span', 'click-power-value');
  stub.makeElement('span', 'slots-used');
  stub.makeElement('span', 'slots-max');

  const btnBuy = stub.makeElement('button', 'btn-buy');
  const mainSpan = stub.makeElement('span');
  mainSpan.textContent = 'COMPRAR';
  const subtext = stub.makeElement('span');
  subtext.classList.add('buy-subtext');
  const costSpan = stub.makeElement('span', 'buy-cost-value');
  subtext.appendChild(costSpan);
  btnBuy.appendChild(mainSpan);
  btnBuy.appendChild(subtext);

  return { btnBuy };
}

function fillGrid(grid) {
  for (let slot = 0; slot < grid.slots.length; slot++) {
    const coords = grid.getSlotCoordinates(slot);
    grid.placeComputer(new Computer(1, slot, coords.centerX, coords.centerY), slot);
  }
  return grid;
}

test('Timeline.update marks eras before active as unlocked and the active era as active', () => {
  const stub = installDom();
  stub.makeElement('div', 'timeline-list');

  const timeline = new Timeline('timeline-list');
  timeline.update(new Set([1, 2, 3]), 3);

  const era1 = stub.document.getElementById('timeline-era-1');
  const era2 = stub.document.getElementById('timeline-era-2');
  const era3 = stub.document.getElementById('timeline-era-3');
  const era4 = stub.document.getElementById('timeline-era-4');

  // Eras before the active one form the lit trail: unlocked, not active.
  assert.equal(era1.classList.contains('unlocked-era'), true);
  assert.equal(era1.classList.contains('active-era'), false);
  assert.equal(era2.classList.contains('unlocked-era'), true);

  // The active era carries both classes.
  assert.equal(era3.classList.contains('active-era'), true);
  assert.equal(era3.classList.contains('unlocked-era'), true);
  assert.equal(stub.document.getElementById('timeline-name-3').textContent, ERAS_DATA[2].name);

  // Future eras stay locked and obfuscated.
  assert.equal(era4.classList.contains('unlocked-era'), false);
  assert.equal(era4.classList.contains('active-era'), false);
  assert.equal(stub.document.getElementById('timeline-name-4').textContent, 'Tecnologia Bloqueada');

  // Progress trail fraction tracks the active marker: (3 - 1) / (6 - 1) = 0.4.
  assert.equal(timeline.container.style.getPropertyValue('--timeline-progress'), '0.4');
});

test('Timeline.update relights state on re-render as the active era advances', () => {
  const stub = installDom();
  stub.makeElement('div', 'timeline-list');

  const timeline = new Timeline('timeline-list');

  timeline.update(new Set([1]), 1);
  assert.equal(stub.document.getElementById('timeline-era-1').classList.contains('active-era'), true);
  assert.equal(stub.document.getElementById('timeline-era-2').classList.contains('unlocked-era'), false);
  assert.equal(timeline.container.style.getPropertyValue('--timeline-progress'), '0');

  timeline.update(new Set([1, 2, 3, 4, 5, 6]), 6);
  const era1 = stub.document.getElementById('timeline-era-1');
  const era6 = stub.document.getElementById('timeline-era-6');
  assert.equal(era1.classList.contains('unlocked-era'), true);
  assert.equal(era1.classList.contains('active-era'), false);
  assert.equal(era6.classList.contains('active-era'), true);
  assert.equal(timeline.container.style.getPropertyValue('--timeline-progress'), '1');
});

test('HUD.update updates the top PP element when coins change', () => {
  const stub = installDom();
  buildHudDom(stub);

  const hud = new HUD();
  const economy = new Economy();
  const grid = new Grid();

  economy.coins = 0;
  hud.update(economy, grid, 1, {});
  assert.equal(stub.document.getElementById('currency-value').textContent, '0');
  assert.equal(stub.document.getElementById('cps-value').textContent, '0');

  // Second update with changed coins exercises the "pop" animation path too.
  economy.coins = 1234;
  hud.update(economy, grid, 1, {});
  assert.equal(stub.document.getElementById('currency-value').textContent, '1.2K');
});

test('HUD.update keeps the buy button disabled when the grid is full', () => {
  const stub = installDom();
  const { btnBuy } = buildHudDom(stub);

  const hud = new HUD();
  const economy = new Economy();
  economy.coins = 1_000_000_000; // afford anything

  const grid = fillGrid(new Grid());
  assert.equal(grid.isFull(), true);

  hud.update(economy, grid, 1, {});

  assert.equal(btnBuy.disabled, true);
  assert.match(stub.document.getElementById('slots-used').textContent, /12/);
});

test('HUD.update enables the buy button when affordable and hides it on victory', () => {
  const stub = installDom();
  const { btnBuy } = buildHudDom(stub);

  const hud = new HUD();
  const grid = new Grid();

  // Affordable + not full: button enabled, main label refreshed from metadata.
  const richEconomy = new Economy();
  richEconomy.coins = 500;
  hud.update(richEconomy, grid, 1, {});
  assert.equal(btnBuy.disabled, false);
  assert.match(btnBuy.querySelector('span:first-child').textContent, /COMPRAR/);

  // Cannot afford: button disabled without the grid being full.
  const brokeEconomy = new Economy();
  brokeEconomy.coins = 5;
  hud.update(brokeEconomy, grid, 1, {});
  assert.equal(btnBuy.disabled, true);

  // Victory hides the buy button entirely.
  hud.update(richEconomy, grid, 1, { victoryTriggered: true });
  assert.equal(btnBuy.style.display, 'none');
});
