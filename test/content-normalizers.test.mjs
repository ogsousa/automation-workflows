import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { normalizeWhatsappContent } from '../src/whatsapp-content.mjs';
import { normalizeInstagramContent } from '../src/instagram-content.mjs';

const cases = JSON.parse(readFileSync(new URL('../fixtures/content-cases.json', import.meta.url), 'utf8'));
const normalizers = {
  whatsapp: normalizeWhatsappContent,
  'instagram-dm': normalizeInstagramContent,
};

for (const fixture of cases) {
  test(fixture.name, () => {
    assert.equal(fixture.synthetic, true);
    const before = JSON.stringify(fixture.input);
    assert.deepEqual(normalizers[fixture.channel](fixture.input), fixture.expected);
    assert.equal(JSON.stringify(fixture.input), before, 'A entrada deve permanecer intacta.');
  });
}
