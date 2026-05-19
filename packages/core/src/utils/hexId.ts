/**
 * Random 8-char uppercase hex id, matching Microsoft's `w14:paraId`
 * extension format (also reused for comment `paraId` / `durableId`).
 *
 * Range is `[0, 0x7FFFFFFE]` — the strictest OOXML `ST_LongHexNumber`
 * bound across all consumers: `w14:paraId` / `w14:textId` / comment
 * `paraId` (`< 0x80000000`) and `w16cid:commentId/@durableId`
 * (`< 0x7FFFFFFF`). Values at or above the relevant cap trigger Word's
 * "Document Recovery — Table Properties" dialog on open and are
 * rejected by strict OOXML validators.
 *
 * Uses `Math.random()` rather than `crypto.randomUUID()` so the
 * generator works in non-secure contexts (file://, web workers).
 */
export function generateHexId(): string {
  return Math.floor(Math.random() * 0x7fffffff)
    .toString(16)
    .toUpperCase()
    .padStart(8, '0');
}
