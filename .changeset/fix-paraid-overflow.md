---
'@eigenpal/docx-editor-react': patch
---

Fix `generateHexId` producing `w14:paraId` / `w14:textId` / comment `durableId` values above the OOXML `ST_LongHexNumber` cap (`< 0x80000000`).

Half of generated IDs landed in `[0x80000000, 0x100000000)`, which Word silently recovers as "Document Recovery — Table Properties" on open and strict OOXML validators reject. The generator now draws from `[0, 0x80000000)` so every ID is spec-valid.
