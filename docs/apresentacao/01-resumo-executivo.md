# Arquitetura Santa Cecília
## Resumo executivo para revisão

**Evento:** palestra de arquitetura de software, Santa Cecília, 8 de outubro de 2026.  
**Palestra completa:** 40 minutos. **Demonstração:** 10 minutos no Build Arch Desktop, com alternativa de 5 minutos.  
**Repositório:** [DevKaue/arquitetura-santa-cecilia](https://github.com/DevKaue/arquitetura-santa-cecilia).  
**Projeto principal:** Arquitetura Santa Cecília, visão de apresentação v10; mapa completo preservado na v9.

### 1. Objetivo da demonstração

Transformar os conceitos dos slides em decisões visíveis: distribuir leituras, proteger a compra, retirar trabalho posterior do tempo de resposta e identificar o gargalo antes de aumentar a infraestrutura. A plateia acompanha três jornadas: consulta ao catálogo, compra transacional e processamento após a compra.

O exemplo mantém o caso de catálogo e compras apresentado no material da palestra. O nome do projeto é **Arquitetura Santa Cecília**. A visão de apresentação reúne 13 blocos e 13 relações em três jornadas, com as réplicas de leitura agrupadas. O mapa completo de 19 blocos/25 relações permanece na v9. Os três laboratórios foram mantidos; o roteiro compara apenas Labs 01 e 03, se houver tempo.

### 2. Problema e premissas

| Premissa | Valor do exercício | Uso na explicação |
|---|---|---|
| Tráfego normal | 2.000 requisições/min | Referência para comparação |
| Pico de campanha | 20.000 requisições/min | Aumento de 10 vezes |
| Perfil do negócio | 95% leitura; 5% escrita | Separar catálogo e compra |
| Cache HIT ilustrativo | 90% das leituras | Calcular alívio no banco, sem confundir com roteamento do simulador |

Com essas premissas, o pico produz 19.000 leituras e 1.000 escritas por minuto. Um HIT de 90% deixa 1.900 leituras chegando ao banco. Essa conta explica uma hipótese de arquitetura; a simulação de carga não aplica automaticamente a proporção 95/5 nem o cache HIT.

### 3. Decisões centrais

| Tema | Decisão | Consequência a discutir |
|---|---|---|
| Leitura | CDN, cache-aside e réplicas | Ganho de latência/capacidade com atraso tolerado no catálogo |
| Compra | Autorizar o dono; reservar no writer | Evitar venda sem estoque e acesso indevido a pedidos |
| Pagamento | Idempotência e reconciliação | Timeout mantém resultado desconhecido até confirmação |
| Assíncrono | Outbox, relay, consumidor e DLQ | Entrega pode repetir; o efeito precisa ser controlado |
| Operação | Métricas, canary e rollback | Detectar degradação e reduzir o impacto de mudança |
| Recuperação | Writer único e região secundária | RPO/RTO propostos exigem teste de restauração e failover |

### 4. Evidência disponível para a demonstração

No cenário temporal de pico 4x, com a mesma entrada, os Labs 01 e 02 produzem latência estimada de 895 ms e erro estimado de 68%. A API cresce de uma para seis instâncias, mas o banco permanece limitante. No Lab 03, a capacidade cadastrada do banco aumenta e os valores passam a 48 ms e 0,05%.

Como exercício complementar, fora do roteiro principal, na carga ao vivo 10x, são geradas 10.000 requisições em 30 segundos virtuais. Após o limite de drenagem, Labs 01/02 deixam aproximadamente 2.650 pendentes; o Lab 03 termina sem pendências. São resultados do modelo do Build Arch, sem representar benchmark HTTP ou SLA real.

O Compose declara nove serviços. A inferência estática pelo motor do Build Arch identificou 23 blocos e 22 relações, incluindo redes, volume, imagens e abstrações de software. Esse resultado permite explicar a revisão humana de um mapa extraído do GitHub.

### 5. Alinhamento com os slides

| Slides | Ponto de revisão |
|---|---|
| 3–4 | Retomar o caso e explicitar que os números são premissas |
| 11 | Consistência depende das operações e do isolamento adotado |
| 14 | TLS pode terminar na entrada; nova sessão protege o backend |
| 18 | Reserva de estoque ocorre no checkout; notificação pode esperar |
| 19–21 | Relacionar segurança, observabilidade, canary e limite de escala |
| 22–23 | Diferenciar simulação temporal 4x, carga ao vivo 10x e gargalo compartilhado |

### 6. Escopo e revisão proposta

O repositório publica o modelo, os manifests e as notas técnicas. Os servidores são um esqueleto para inferência: catálogo sintético, health endpoints e checkout com resposta 501. Pagamento, consumidor e relay reais não estão implementados. A sintaxe do Compose foi validada; os containers não foram executados.

A distribuição sugerida é 26 minutos de slides/conclusão, 10 de demonstração e 4 de perguntas. A demo não exige montagem de componentes, navegação por versões nem modelagem de dados ao vivo.

Para revisar, abrir o backup principal, acompanhar o roteiro curto e conferir: separação leitura/compra, reserva concorrente, idempotência, evento de confirmação de compra, limites de retry, DLQ, redundância e metas de recuperação. Revisar especialmente as correções propostas para os slides 14 e 18 antes do ensaio conjunto.
