# Arquitetura Santa Cecília

**Sistemas escaláveis, seguros e preparados para o mundo real.**

Exemplo da palestra na Santa Cecília, em 8 de outubro de 2026. O material acompanha a evolução de uma plataforma de catálogo e compras e demonstra decisões de arquitetura no **Build Arch Desktop**.

## Demonstração pelo GitHub

No Build Arch: **Analisar projeto → GitHub público**.

```text
Repositório: https://github.com/DevKaue/arquitetura-santa-cecilia
Referência:  main
```

Executar a análise, revisar evidências e abrir o rascunho gerado. O Compose descreve nove serviços, redes e volume. A inferência verificada identificou 23 blocos e 22 relações; esse mapa inclui imagens e abstrações de software. O desenho revisado em [buildarch/](buildarch/) está em **v22: 23 blocos organizados por camadas e jornadas, 40 relações e 22 revisões**. Borda/entrada à esquerda, catálogo e compra em ramos distintos, dados e trabalho posterior próximos das aplicações, observabilidade à direita e entrega/orquestração na base. A referência v19, os ajustes v20 e a organização linear v21 permanecem no histórico. v12–v19 correspondem aos slides 5 e 13–19. O guia de leitura acompanha as oito peças da palestra e os temas de operação, sem transformar controle/telemetria em etapas HTTP.

## Navegação

| Material | Uso |
|---|---|
| [Resumo executivo](docs/apresentacao/01-resumo-executivo.md) | Revisar decisões e alinhar os slides |
| [Roteiro conforme a palestra](docs/apresentacao/02-roteiro-demonstracao.md) | Conduzir a demonstração e importar do GitHub |
| [Cartão do apresentador](docs/apresentacao/03-cartao-apresentador.md) | Consultar parâmetros e sequência durante o ensaio |
| [Perguntas e respostas](docs/apresentacao/04-perguntas-respostas.md) | Apoiar a discussão com a plateia |
| [Guia de leitura por camadas](docs/apresentacao/07-guia-de-leitura-por-camadas.md) | Retomar as oito peças dos slides e acompanhar catálogo e compra |
| [Guia da referência v19 em PDF](docs/apresentacao/guia-da-palestra.pdf) | Consultar o conteúdo completo e a correspondência dos slides |
| [Visão e decisões](docs/arquitetura/01-visao-e-decisoes.md) | Jornadas, trade-offs e operação |
| [Modelo de dados](docs/arquitetura/02-modelo-de-dados.md) | Pedidos, reservas, outbox e deduplicação |
| [Checkout e eventos](docs/arquitetura/03-checkout-e-eventos.md) | Sequência transacional e integração externa |
| [Correspondência dos 25 slides](docs/arquitetura/04-correspondencia-palestra.md) | Conferir a fidelidade às fontes e distinguir complementos |
| [Roteiro curto opcional](docs/apresentacao/05-roteiro-curto-opcional.md) | Escolher condução de 10/5 min sem limitar o mapa |
| [Validação](docs/validacao/README.md) | Evidências, parâmetros e limites |

## O que o exemplo ensina

- Leitura eventual em CDN/cache/réplicas e compra autoritativa no writer.
- Reserva concorrente, autorização por pedido e idempotência.
- Fila/worker, observabilidade e multi-região conforme os slides; outbox/DLQ no aprofundamento preservado.
- Diagnóstico de gargalo: aumentar APIs pode manter o banco limitante.
- Orquestração, autoscaling com teto, sala de espera, modo degradado e entrega gradual.
- Compute, storage, egress e CDN; sem preços fixos nem provedor obrigatório.

## Estrutura

```text
buildarch/          arquitetura revisada e três laboratórios
docs/apresentacao/  resumo, roteiro, cartão e perguntas
docs/arquitetura/   decisões, modelo de dados e fluxo transacional
docs/validacao/     evidências e limites da demonstração
services/          web, catálogo, checkout, relay e worker
gateway/           entrada NGINX do ambiente local
database/          schema SQL com invariantes complementares
scripts/           verificação dos contratos do repositório
docker-compose.yml inventário de nove serviços para inferência
```

## Escopo do código

Os endpoints são demonstrativos: `/health`, catálogo sintético em `/catalog` e checkout com resposta **501**. Relay e worker expõem saúde, sem publicar/consumir eventos. As notas técnicas descrevem o workflow a implementar. DNS/CDN, identidade, réplicas, HA e DR são decisões do mapa; o Compose não as implanta.

## Verificação local

Requer Node.js 24 e npm. Executar `npm ci` e `npm run verificar`. O comando confere contratos dos backups, relações de dados e inventário do Compose. Os relatórios do motor do Build Arch estão em `docs/validacao/`.

Para consultar o endpoint sintético: `npm run catalogo` e abrir `http://127.0.0.1:3000/catalog`. O Compose exige `POSTGRES_PASSWORD` no ambiente. Apenas o gateway publica porta em loopback; banco, cache e broker não expõem portas do host. O Compose não foi executado como implantação nesta preparação.

Todos os dados são de demonstração. O repositório não contém fontes privadas do Build Arch, credenciais, slides originais ou projetos pessoais.
