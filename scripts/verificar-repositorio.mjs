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
    assert.equal(project.version, 22);
    assert.equal(project.nodes.length, 23);
    assert.equal(project.edges.length, 40);
    assert.equal(project.revisions.length, 22);
    const linear = JSON.parse(read('docs/validacao/layout-linear.json'));
    const historicalLinear = project.revisions.find((r) => r.version === 21);
    assert.deepEqual(historicalLinear.nodes.map((node) => node.id), linear.nodeOrder);
    assert.ok(historicalLinear.nodes.every((node) => node.position.y === 0));
    const layers = JSON.parse(read('docs/validacao/layout-camadas.json'));
    assert.equal(layers.version, project.version);
    assert.deepEqual(Object.values(layers.groups).flat().sort(), project.nodes.map((node) => node.id).sort());
    assert.deepEqual(layers.readingOrder.map((piece) => piece.piece), [1, 2, 3, 4, 5, 6, 7, 8]);
    const referenceNodes = new Map(project.revisions.find((r) => r.version === 19).nodes.map((node) => [node.id, node]));
    for (const node of project.nodes) {
      assert.deepEqual(node.position, layers.positions[node.id]);
      const { label: oldLabel, ...oldData } = referenceNodes.get(node.id).data;
      const { label: newLabel, ...newData } = node.data;
      assert.deepEqual(newData, oldData, `Conteúdo técnico alterado: ${node.id}`);
    }
    const { width, height } = layers.nodeEnvelope;
    for (let i = 0; i < project.nodes.length; i++) {
      for (let j = i + 1; j < project.nodes.length; j++) {
        const a = project.nodes[i].position;
        const b = project.nodes[j].position;
        assert.ok(Math.abs(a.x - b.x) >= width || Math.abs(a.y - b.y) >= height, 'Blocos sobrepostos no layout.');
      }
    }
    assert.deepEqual(project.edges, project.revisions.find((r) => r.version === 19).edges, 'A organização por camadas deve preservar as relações.');
    const full = project.revisions.find((revision) => revision.version === 9);
    assert.equal(full.nodes.length, 19, 'O mapa completo deve permanecer no histórico.');
    assert.equal(full.edges.length, 25);
    for (const id of ['read1', 'read2']) assert.equal(project.nodes.find((node) => node.id === id).data.instances, 1);
    const alignment = JSON.parse(read('docs/validacao/alinhamento-palestra.json'));
    assert.equal(alignment.coverage.length, 25);
    assert.deepEqual(alignment.coverage.map((row) => row.slide), Array.from({ length: 25 }, (_, i) => i + 1));
    for (const row of alignment.coverage) {
      const snapshot = row.revision ? project.revisions.find((r) => r.version === row.revision) : project;
      assert.ok(snapshot, `Revisão ausente para slide ${row.slide}`);
      for (const id of row.nodes) assert.ok([...snapshot.nodes, ...project.nodes].some((n) => n.id === id), `Slide ${row.slide}: bloco ausente no principal/evolução ${id}`);
    }
    assert.deepEqual(project.revisions.find((r) => r.version === 15).nodes.filter((n) => /^app[123]$/.test(n.id)).map((n) => n.data.label), ['App 1', 'App 2', 'App 3']);
    assert.equal(project.nodes.find((n) => n.id === 'worker').data.runtime.maxReplicas, 20);
    for (const node of project.nodes) {
      assert.ok(node.data.description.includes('Slide') || node.data.description.includes('slide'));
      assert.ok(node.data.description.length <= 800, `Descrição excede limite do Build Arch: ${node.id}`);
    }
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
