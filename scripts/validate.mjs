import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = new URL('../', import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), 'utf8'));
const fixtures = readJson('fixtures/content-cases.json');
readJson('package.json');

const forbiddenKeys = new Set(['credentials', 'webhookId', 'pinData', 'staticData', 'meta', 'url']);
function inspect(value) {
  if (Array.isArray(value)) return value.forEach(inspect);
  if (!value || typeof value !== 'object') return;
  for (const [key, item] of Object.entries(value)) {
    assert.equal(forbiddenKeys.has(key), false, `Campo proibido na demonstracao: ${key}`);
    inspect(item);
  }
}

const allowedTypes = new Set(['n8n-nodes-base.manualTrigger', 'n8n-nodes-base.code']);
for (const filename of readdirSync(new URL('examples/', root)).filter((file) => file.endsWith('.json'))) {
  const workflow = readJson(`examples/${filename}`);
  inspect(workflow);
  assert.equal(workflow.active, false);
  assert.equal(workflow.nodes.length, 2);
  const names = new Set(workflow.nodes.map((node) => node.name));
  assert.equal(names.size, workflow.nodes.length);
  for (const node of workflow.nodes) assert.equal(allowedTypes.has(node.type), true);
  for (const [source, channels] of Object.entries(workflow.connections)) {
    assert.equal(names.has(source), true);
    for (const groups of Object.values(channels)) {
      for (const group of groups) {
        for (const edge of group) assert.equal(names.has(edge.node), true);
      }
    }
  }
  const code = workflow.nodes.find((node) => node.type === 'n8n-nodes-base.code').parameters.jsCode;
  assert.doesNotMatch(code, /https?:\/\/|\bfetch\s*\(|\brequire\s*\(|process\.env|\$env|\$credentials|Bearer\s/i);
  // Executa apenas o exemplo local e autoral, com timeout e sem objetos de I/O.
  // Este contexto nao e apresentado como sandbox para codigo nao confiavel.
  const output = runInNewContext(`(() => { ${code} })()`, {}, { timeout: 1000 });
  const channel = filename.startsWith('whatsapp') ? 'whatsapp' : 'instagram-dm';
  const expected = fixtures.find((fixture) => fixture.channel === channel).expected;
  assert.deepEqual(JSON.parse(JSON.stringify(output)), [{ json: expected }]);
  console.log(`${filename}: JSON, referencias e resultado offline OK`);
}
console.log(`${fixtures.length} fixtures sinteticas verificadas; nenhuma importacao n8n foi executada.`);
