# Arquitetura Santa Cecília
## Cartão do apresentador

**Principal: v22 · 23 blocos · 40 relações · camadas e jornadas.** Enquadrar o canvas e conferir **Salvo agora**. A sequência segue os slides; ajustar a duração durante o ensaio conjunto.


Para a disposição atual e os ganchos das oito peças, usar o [guia de leitura por camadas](07-guia-de-leitura-por-camadas.md).

| Slides | O que apontar | Frase para ligar ao conteúdo |
|---|---|---|
| 3–5 | Usuários / v12 inicial | “O problema e o pico definem as peças.” |
| 6–12 | Métricas, apps e dependências | “Tempo de resposta e capacidade são medidas diferentes.” |
| 13 / v13 | Cliente, DNS, CDN | “Resolver o domínio e entregar perto do usuário.” |
| 14 / v14 | Load Balancer | “Distribuir para instâncias saudáveis, com TLS.” |
| 15 / v15 | App 1, 2 e 3 | “Qualquer instância pode atender; autorização vem antes do domínio.” |
| 16 / v16 | Cache | “Consulta repetida não precisa chegar ao banco.” |
| 17 / v17 | Writer / duas réplicas | “Catálogo aceita atraso; compra usa a fonte da verdade.” |
| 18 / v18 | Fila, telemetria, região | “Trabalho posterior, visibilidade e proximidade.” |
| 19 / v22 | Todas as camadas | “A tecnologia muda; a função permanece.” |
| 20–21 | Canary, teto, espera | “Reduzir o alcance do erro e controlar a entrada.” |
| 22–23 | Labs 01/02/03 | “Escalar a peça errada mantém o gargalo.” |
| 24–25 | Custos / histórico | “Medir, escolher e manter caminho de volta.” |

### Números do material original

**95/5; pico 10x; 90% conteúdo estável; 50 mil mensagens/h; workers 3→20; aviso ilustrativo 3 min; leitura local 40 ms versus 220 ms.** Não confundir 90% conteúdo estável com HIT do cache, nem antecipação ilustrativa com garantia.

### Controles dos Labs

**Carga ao vivo: selecionar os Labs.** O principal v22 contém ciclos entre planos de controle/operação e é recusado pelo Laboratório de carga. [Diagnóstico e procedimento](08-diagnostico-da-simulacao.md).

Temporal: **2.000 req/min · Pico · 4x · 10 min virtuais · Nenhuma falha**. Labs 01/02: **895 ms / 68%**; Lab 03: **48 ms / 0,05%**. São saídas do modelo.

Carga ao vivo: **2.000 usuários · 10 ações/min · 30 s virtuais**. 10.000 geradas; Labs 01/02 deixam ~2.650 pendentes; Lab 03 drena tudo. Os slides não fixam esses controles.

### URL complementar pronta

**https://github.com/DevKaue/arquitetura-santa-cecilia**, referência **main**. **Analisar projeto → GitHub público**. Conferir evidências; inferência verificada: **23 blocos/22 relações**, distinta do principal manual **23/40**.

### Apoio e contingência

Versões anteriores e três Labs mantidos. Outbox/DLQ/schema estão no aprofundamento; não fazem parte da figura original do slide 19. Se faltar rede, usar o projeto salvo. [Opções de 10 e 5 minutos](05-roteiro-curto-opcional.md) disponíveis sem limitar o principal.
