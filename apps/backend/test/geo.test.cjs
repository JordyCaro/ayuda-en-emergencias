'use strict';

const assert = require('node:assert/strict');
const { describe, it } = require('node:test');
const {
  assertValidBBox,
  clampLimit,
  isValidLatLng,
} = require('../dist/common/geo.js');

describe('geo helpers', () => {
  it('accepts Bogotá bbox', () => {
    const b = assertValidBBox({
      west: -74.2,
      south: 4.5,
      east: -74.0,
      north: 4.8,
    });
    assert.equal(b.west, -74.2);
  });

  it('rejects west >= east', () => {
    assert.throws(() =>
      assertValidBBox({ west: -74, south: 4, east: -75, north: 5 }),
    );
  });

  it('rejects huge bbox', () => {
    assert.throws(() =>
      assertValidBBox({ west: -80, south: -4, east: -67, north: 12 }),
    );
  });

  it('validates lat/lng', () => {
    assert.equal(isValidLatLng(4.7, -74.0), true);
    assert.equal(isValidLatLng(100, -74), false);
  });

  it('clamps limit', () => {
    assert.equal(clampLimit(undefined), 200);
    assert.equal(clampLimit(9000), 800);
    assert.equal(clampLimit(50), 50);
  });
});
