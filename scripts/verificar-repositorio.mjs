import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const files = fs.readdirSync(path.join(root, 'buildarch')).filter((f) => f.endsWith('.buildarch.json'));
assert.equal(files.length, 4, 'São esperados a arquitetura final e três Labs.');

function verifyGraph(project) {
  const ids = new Set(project.nodes.map((node) => node.id));
  assert.equal(ids.size, project.nodes.length, 'IDs de componentes devem ser únicos.');
  assert.equal(new Set(project.edges.map((edge) => edge.id)).size, project.edges.length);
  for (const edge of project.edges) {
    assert.ok(ids.has(edge.source) && ids.has(edge.target), `Conexão inválida: ${edge.id}`);
  }
}

for (const file of files) {
  const project = JSON.parse(read(`buildarch/${file}`));
  verifyGraph(project);
  for (const revision of project.revisions ?? []) verifyGraph(revision);
  if (file.startsWith('00-')) {
    assert.equal(project.name, 'Arquitetura Santa Cecília');
    assert.equal(project.version, 9);
    assert.equal(project.nodes.length, 19);
    assert.equal(project.edges.length, 25);
    assert.equal(project.revisions.length, 9);
    const tables = project.nodes.find((node) => node.id === 'primary').data.schema.tables;
    assert.equal(tables.length, 8);
    const byId = new Map(tables.map((table) => [table.id, table]));
    for (const table of tables) {
      assert.ok(table.columns.some((column) => column.primaryKey));
      assert.equal(new Set(table.columns.map((c) => c.name)).size, table.columns.length);
      for (const column of table.columns.filter((c) => c.references)) {
        const target = byId.get(column.references.tableId)?.columns.find((c) => c.id === column.references.columnId);
        assert.ok(target, `FK sem alvo: ${table.name}.${column.name}`);
        assert.equal(target.type, column.type);
        assert.ok(target.primaryKey || target.unique);
      }
    }
    assert.ok(byId.has('reservations') && byId.has('processed_events') && byId.has('outbox'));
  } else {
    assert.equal(project.nodes.length, 4);
    assert.equal(project.edges.length, 3);
    const number = Number(project.id.at(-1));
    assert.equal(project.nodes.find((node) => node.id === 'api').data.instances, number === 1 ? 1 : 6);
    assert.equal(project.nodes.find((node) => node.id === 'db').data.capacity, number === 3 ? 20000 : 3000);
  }
}

const document = parseDocument(read('docker-compose.yml'));
assert.equal(document.errors.length, 0, 'O Compose deve ter sintaxe YAML válida.');
const compose = document.toJS();
assert.deepEqual(Object.keys(compose.services).sort(), ['catalog', 'checkout', 'gateway', 'postgres', 'rabbitmq', 'redis', 'relay', 'web', 'worker']);
assert.deepEqual(compose.services.checkout.depends_on, ['postgres']);
assert.deepEqual(compose.services.relay.depends_on, ['postgres', 'rabbitmq']);
for (const name of ['postgres', 'redis', 'rabbitmq']) assert.equal(compose.services[name].ports, undefined);
assert.equal(compose.services.gateway.ports[0], '127.0.0.1:8080:8080');
assert.ok(compose.services.postgres.environment.POSTGRES_PASSWORD.startsWith('${POSTGRES_PASSWORD:'));
for (const service of Object.values(compose.services)) {
  for (const dependency of service.depends_on ?? []) assert.ok(compose.services[dependency]);
  for (const network of service.networks ?? []) assert.ok(Object.hasOwn(compose.networks, network));
}

const results = JSON.parse(read('docs/validacao/resultados-verificados.json'));
assert.equal(results.length, 3);
assert.equal(results[0].simulations.find((r) => r.pattern === 'spike').latency, results[1].simulations.find((r) => r.pattern === 'spike').latency);
assert.ok(results[2].live.pending < 0.001);
console.log('Conferidos: quatro backups, histórico, oito tabelas/FKs, contratos dos Labs e nove serviços do Compose.');
console.log('Esta verificação não executa containers nem substitui testes do workflow de compra.');
