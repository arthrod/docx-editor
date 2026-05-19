import { describe, test, expect } from 'bun:test';
import { generateHexId } from './hexId';

describe('generateHexId', () => {
  test('always produces 8 uppercase hex characters', () => {
    for (let i = 0; i < 1000; i += 1) {
      const id = generateHexId();
      expect(id).toMatch(/^[0-9A-F]{8}$/);
    }
  });

  // OOXML ST_LongHexNumber (w14:paraId / w14:textId) caps values at
  // < 0x80000000. Word silently recovers any over-cap paraId/textId on
  // open and surfaces it as a "Document Recovery — Table Properties"
  // dialog, so values >= 0x80000000 are spec-invalid even though they
  // fit in 8 hex chars.
  test('never produces a value >= 0x80000000 (ST_LongHexNumber cap)', () => {
    const TRIALS = 20_000;
    for (let i = 0; i < TRIALS; i += 1) {
      const id = generateHexId();
      const value = parseInt(id, 16);
      expect(value).toBeLessThan(0x80000000);
    }
  });

  test('covers the full valid range up to (but not including) the cap', () => {
    // Stress the boundary: with 20 000 trials and a half-range uniform
    // distribution, P(max < 0x40000000) ≈ 2.7e-2 700, so a passing
    // generator must produce at least one value in the upper half of
    // the valid range [0x40000000, 0x80000000).
    let sawUpperHalf = false;
    for (let i = 0; i < 20_000 && !sawUpperHalf; i += 1) {
      const v = parseInt(generateHexId(), 16);
      if (v >= 0x40000000 && v < 0x80000000) sawUpperHalf = true;
    }
    expect(sawUpperHalf).toBe(true);
  });
});
