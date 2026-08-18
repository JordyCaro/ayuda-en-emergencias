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

const {
  foldName,
  formatOsmPlace,
  matchCityByName,
  nearestCity,
} = require('../dist/geo/resolve-location.js');

describe('resolve-location', () => {
  it('folds accents and Bogotá D.C.', () => {
    assert.equal(foldName('Bogotá, D.C.'), 'bogota');
    assert.equal(matchCityByName('Bogotá')?.code, '11001');
    assert.equal(matchCityByName('Cartagena')?.code, '13001');
    assert.equal(matchCityByName('La Estrella')?.code, '05380');
  });

  it('does not confuse Girón with Girardot', () => {
    assert.equal(matchCityByName('Girón')?.code, '68307');
    assert.equal(matchCityByName('Girardot')?.code, '25307');
  });

  it('formats OSM street + barrio + city', () => {
    const r = formatOsmPlace({
      road: 'Calle 80 Sur',
      suburb: 'La Tablaza',
      city: 'La Estrella',
    });
    assert.equal(r.cityCode, '05380');
    assert.equal(r.label, 'Calle 80 Sur, La Tablaza, La Estrella');
  });

  it('picks La Estrella over Medellín for south Aburrá GPS', () => {
    const city = nearestCity(6.15351, -75.63908);
    assert.equal(city?.code, '05380');
  });
});
