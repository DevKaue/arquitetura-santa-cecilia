# Arquitetura Santa Cecília

**Sistemas escaláveis, seguros e preparados para o mundo real.**

Exemplo da palestra na Santa Cecília, em 8 de outubro de 2026. O material acompanha a evolução de uma plataforma de catálogo e compras e demonstra decisões de arquitetura no **Build Arch Desktop**.

## Demonstração pelo GitHub

No Build Arch: **Analisar projeto → GitHub público**.

```text
Repositório: https://github.com/DevKaue/arquitetura-santa-cecilia
Referência:  main
```

Executar a análise, revisar evidências e abrir o rascunho gerado. O Compose descreve nove serviços, redes e volume. A inferência verificada identificou 23 blocos e 22 relações; esse mapa inclui imagens e abstrações de software. O desenho revisado em [buildarch/](buildarch/) tem uma visão compacta v10 com 13 blocos/13 relações; o mapa completo de 19 blocos/25 relações está preservado na v9.

## Navegação

| Material | Uso |
|---|---|
| [Resumo executivo](docs/apresentacao/01-resumo-executivo.md) | Revisar decisões e alinhar os slides |
| [Roteiro de 10 minutos](docs/apresentacao/02-roteiro-demonstracao.md) | Conduzir a demonstração e importar do GitHub |
| [Cartão do apresentador](docs/apresentacao/03-cartao-apresentador.md) | Consultar parâmetros e sequência durante o ensaio |
| [Perguntas e respostas](docs/apresentacao/04-perguntas-respostas.md) | Apoiar a discussão com a plateia |
| [Guia da palestra em PDF](docs/apresentacao/guia-da-palestra.pdf) | Enviar para revisão e consultar o material diagramado |
| [Visão e decisões](docs/arquitetura/01-visao-e-decisoes.md) | Jornadas, trade-offs e operação |
| [Modelo de dados](docs/arquitetura/02-modelo-de-dados.md) | Pedidos, reservas, outbox e deduplicação |
| [Checkout e eventos](docs/arquitetura/03-checkout-e-eventos.md) | Sequência transacional e integração externa |
| [Validação](docs/validacao/README.md) | Evidências, parâmetros e limites |

## O que o exemplo ensina

- Leitura eventual em CDN/cache/réplicas e compra autoritativa no writer.
- Reserva concorrente, autorização por pedido e idempotência.
- Outbox relay, confirmação do broker, consumidor idempotente e DLQ.
- Diagnóstico de gargalo: aumentar APIs pode manter o banco limitante.
- Observabilidade, entrega gradual e recuperação com RPO/RTO propostos.

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
