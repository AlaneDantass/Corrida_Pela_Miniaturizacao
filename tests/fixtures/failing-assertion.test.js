import assert from 'node:assert/strict';
import test from 'node:test';

test('intentional failing assertion fixture', () => {
  assert.equal(1, 2, 'intentional assertion failure');
});
