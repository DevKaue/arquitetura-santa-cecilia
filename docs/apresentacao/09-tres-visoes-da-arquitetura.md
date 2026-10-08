# Três visões complementares da arquitetura

As duas novas visões retomam as imagens dos slides 19 e 17 do PPT e do PDF originais. O projeto principal permanece como síntese. Os números 01/02/03 abaixo indicam a sequência sugerida para a demonstração; os números v1/v22 da linha do tempo são revisões internas de cada projeto.

| Ordem | Projeto no Build Arch | Referência | Objetivo |
|---|---|---|---|
| 01 | **Arquitetura Santa Cecília \| 01 Camadas** | Primeira imagem, slide 19 | Localizar responsabilidades: borda, entrada, containers, dados, observabilidade e entrega |
| 02 | **Arquitetura Santa Cecília \| 02 Escala** | Segunda imagem, slide 17; retomada dos slides 13–16 | Explicar cópias stateless, cache, escrita autoritativa e réplicas de leitura |
| 03 | **Arquitetura Santa Cecília** | Síntese dos slides 13–21 | Reunir as decisões no exemplo completo, com assíncrono, operação, região secundária e proteção no pico |

No Desktop, usar o seletor de projetos no topo e procurar **Santa Cecília**. As duas novas visões são projetos próprios, com revisão inicial marcada. Assim, é possível alternar entre os mapas sem editar o desenho durante a apresentação. O principal e todo o seu histórico foram preservados, inclusive os ajustes feitos no Desktop.

## 01 — Entender onde cada responsabilidade fica

**Fala de abertura:** “Vamos transformar as peças que vocês acabaram de ver em um mapa. Primeiro, onde cada responsabilidade fica; depois, como ela cresce.”

1. **Borda, no topo:** usuários, WAF/anti-DDoS, CDN e DNS. A proteção barra tráfego indevido; a CDN aproxima conteúdo estático; DNS resolve o destino. A seta de DNS é uma dependência de resolução, não um salto HTTP obrigatório depois da CDN.
2. **Entrada:** Gateway/Load Balancer e autenticação. Retomar TLS, rate limiting, distribuição para instâncias saudáveis e autenticação/autorização antes do domínio. O vínculo OIDC representa validação de identidade; não exige uma consulta remota ao provedor em cada pedido.
3. **Containers e aplicações:** catálogo, checkout e notificações têm responsabilidades distintas. Containers/Kubernetes executam essas aplicações. Autoscaler recebe sinais de CPU/fila e ajusta réplicas pelo plano de controle; não fica no caminho de cada requisição.
4. **Dados, na base:** banco relacional, cache e fila. A compra grava a fonte da verdade. Cache acelera consultas. Notificações podem ser feitas depois da compra, pela fila. A relação catálogo/banco nesta visão resume a camada de dados; o próximo mapa abre a separação entre writer e réplicas.
5. **Operação, à direita:** métricas e dashboards, logs centralizados, CI/CD e análise estática por PR. A operação observa e permite evoluir a arquitetura. As conexões de telemetria são representativas; não indicam que apenas o componente ligado precisa ser observado.

**Gancho para a próxima visão:** “Organizar as camadas explica quem faz o quê. Mas, com 95% de leitura e 5% de escrita, também precisamos decidir quais partes crescem juntas e quais crescem separadamente.”

## 02 — Crescer sem misturar leitura e escrita

**Fala de abertura:** “Agora aproximamos o olhar para a aplicação e para os dados. É o mesmo caso, visto pelo problema do escalonamento.”

1. **Usuários, DNS/CDN e Load Balancer:** retomar proximidade do conteúdo e retirada de instâncias não saudáveis.
2. **App 1, App 2 e App 3:** são três cópias da mesma aplicação stateless, como nos slides 15 e 17. Qualquer cópia pode atender qualquer requisição. Não são três microserviços diferentes. Adicionar cópias aumenta capacidade da aplicação; o banco ainda pode limitar o conjunto.
3. **Caminho de leitura:** catálogo e busca consultam cache. Em HIT, evitam SQL. Em MISS, a aplicação consulta uma réplica saudável; A e B são alternativas, não duas consultas obrigatórias. O mapa mostra essas relações diretamente da aplicação para deixar claro quem acessa cada destino.
4. **Caminho de escrita:** checkout grava diretamente no banco principal. Não passa pelo cache para decidir compra/estoque e não usa uma réplica atrasada como fonte autoritativa.
5. **Writer e réplicas:** o principal propaga dados às réplicas; a leitura pode atrasar. Retomar criptografia em repouso e credenciais de menor privilégio. Separar leitura e escrita permite dimensionar cada lado conforme sua demanda.

**Cuidados na fala:** 95/5 é o perfil do caso fornecido nos slides. Não é uma taxa de HIT. Não chamar réplica de leitura de segundo writer nem prometer failover automático só porque há uma seta de replicação. Os exemplos de latência regional dos slides são exemplos da palestra, não medições do Build Arch.

**Gancho para a síntese:** “A primeira visão mostrou as responsabilidades; esta mostrou como aplicação, leitura e escrita crescem. Agora reunimos essas decisões com trabalho assíncrono e operação.”

## 03 — Percorrer o exemplo completo

Abrir **Arquitetura Santa Cecília**. Manter o guia [Leitura por camadas](07-guia-de-leitura-por-camadas.md) como referência detalhada.

- **Catálogo:** borda e entrada → API de catálogo → cache; no MISS, uma réplica de leitura.
- **Compra:** entrada e autorização → API de checkout → banco de escrita; trabalho posterior segue pela fila até notificações.
- **Pico e continuidade:** sinais de CPU/fila → autoscaler/orquestração; sala de espera controla admissão; DNS e região secundária retomam a continuidade regional.
- **Operação e evolução:** métricas, logs e tracing ajudam a entender o comportamento; análise estática e CI/CD apoiam entrega gradual e rollback.

O mapa completo reúne funções de diferentes planos. Não apresentar todas as suas setas como etapas consecutivas de uma requisição. O schema e os detalhes de implementação adicionais permanecem como aprofundamento, distinguido do conteúdo obrigatório dos slides.

## Carga e escolha de falha

Estas visões são mapas conceituais. Criá-las não corrige o motor do Laboratório de carga: ele ainda percorre todas as conexões, reparte saídas igualmente e não implementa condicionais HIT/MISS nem a distribuição 95/5. A visão 01 e a síntese contêm ciclos válidos de controle/telemetria que impedem iniciar esse laboratório. A visão 02 é acíclica e aceita carga e seleção de falha no motor, mas seus resultados seguem essas limitações; uma falha selecionada não aciona um failover real.

Para ensaio quantitativo, manter os [Labs e o diagnóstico](08-diagnostico-da-simulacao.md). O pedido de carga massiva fiel no desenho completo continua dependendo de adequação do simulador; estas novas visões não devem ser anunciadas como essa correção.

## Arquivos para revisão e importação

- [Visão 01 — Camadas](../../buildarch/04-visao-camadas.buildarch.json)
- [Visão 02 — Escala](../../buildarch/05-visao-escalabilidade.buildarch.json)
- [Síntese existente](../../buildarch/00-arquitetura-santa-cecilia.buildarch.json)
- [Registro de fontes, posições e contagens](../validacao/visoes-complementares.json)

Importar backups por **Arquivo → Abrir backup → Abrir como novo projeto**. Importar o repositório pelo analisador do GitHub produz um rascunho inferido; não restaura automaticamente estes mapas. O PDF/PPT originais continuam fora do repositório público.
