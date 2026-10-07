# Arquitetura Santa Cecília
## Resumo executivo para revisão

**Referência:** os 25 slides do PPT e as 25 páginas do PDF “Como projetar sistemas escaláveis, seguros e preparados para o mundo real”, fornecidos para a palestra de 8 de outubro de 2026. **Principal no Build Arch Desktop: v22, 23 blocos, 40 relações, organizados por camadas e jornadas.** O conteúdo acompanha a palestra inteira; a duração da fala fica a critério dos apresentadores.


Para a disposição atual e os ganchos das oito peças, usar o [guia de leitura por camadas](07-guia-de-leitura-por-camadas.md).

### O caso e as perguntas de negócio

Loja disponível em vários países, com clientes em vários continentes/fusos e milhões de visitas por dia. Black Friday pode multiplicar o tráfego por **10x**; o perfil é **95% leitura / 5% escrita**. Erros de estoque, pedido duplicado ou cobrança errada tornam checkout/pagamento críticos (slides 3–4).

Antes das peças: quantos usuários e de onde, qual pico, o que não pode cair e o que pode demorar a atualizar. Exibir estoque com atraso pode ser aceitável; decidir a compra exige o dado autoritativo.

### As oito peças explicadas na palestra

| Peça | Função no principal | Referência |
|---|---|---|
| Borda: cliente, DNS e CDN | Resolver destino e aproximar conteúdo estático; WAF/anti-DDoS na referência final | 13, 19 |
| Load Balancer / entrada | Distribuir para instâncias saudáveis; TLS, limites e controle de acesso | 10, 14, 19, 21 |
| Aplicação stateless | Escalar cópias sem sessão local; autenticação e autorização antes do domínio | 8, 15, 19 |
| Cache | Absorver consultas repetidas; proteger dados sensíveis | 9, 16 |
| Writer e réplicas | Separar escrita autoritativa e leitura eventual | 11, 17 |
| Fila e workers | Retirar trabalho posterior da resposta; escalar por fila | 18–19 |
| Observabilidade | Métricas, logs e tracing para identificar saturação e falhas | 18–19, 22–23 |
| Multi-região | Proximidade do cliente e continuidade quando uma região falha | 18 |

### O desenho de referência e o mundo real

A v19 explicita as camadas do slide 19: **borda, entrada, orquestração, dados, observabilidade e entrega**. WAF e CDN são blocos separados. As duas réplicas continuam separadas. Autenticação, Kubernetes ou equivalente, autoscaler, dashboards, logs e análise estática têm função visível.

O mapa também inclui tracing e região secundária do slide 18. **Sala de espera** representa a política opcional do slide 21, distinta da fila de trabalho. Timeout/retry/circuit breaker, modo degradado, teto de escala, alarme, canary e rollback estão descritos nas peças responsáveis. Nenhum deles depende de acrescentar uma caixa fictícia para cada conceito.

### Exemplos numéricos preservados das fontes

| Exemplo da palestra | Significado |
|---|---|
| 95% / 5%; pico 10x | Perfil de leitura/escrita e crescimento do tráfego |
| 90% de conteúdo estável | Justificativa da CDN no slide 13; não é taxa de cache HIT medida |
| 50 mil mensagens por hora; 3 para 20 workers | Exemplo assíncrono do slide 18 |
| Latência aumenta 3 min antes do primeiro erro | Exemplo de observação do slide 18; antecipação não garantida |
| 40 ms local / 220 ms cruzando o Atlântico | Exemplo de proximidade regional do slide 18 |
| 99% | Aproximadamente 3,65 dias fora do ar/ano, no slide 7 |
| 99,9% | Aproximadamente 8,8 horas fora do ar/ano |
| 99,99% | Aproximadamente 52 minutos fora do ar/ano |
| 99,999% | Aproximadamente 5 minutos fora do ar/ano |

Os slides não definem 2.000 req/min, TTL de 60 s, cache HIT de 90% ou metas numéricas RPO/RTO. Esses parâmetros surgiram no aprofundamento anterior e nos Labs; não são apresentados como dados do material original.

### Evolução disponível no histórico

| Revisão | O que mostrar |
|---|---|
| v12 | Slide 5: servidor e banco únicos |
| v13 | Slide 13: cliente, DNS e CDN |
| v14 | Slide 14: entrada e TLS |
| v15 | Slide 15: App 1, App 2 e App 3 |
| v16 | Slide 16: cache |
| v17 | Slide 17: writer e duas réplicas |
| v18 | Slide 18: fila, observabilidade e multi-região |
| v19 | Referência completa e operação dos slides 19–25 |

As versões v1–v10 e o estado do Desktop anterior à reorganização (v11) foram preservados. A v9 mantém outbox, relay, DLQ e pagamento externo como aprofundamento. Os três Labs e o schema de oito tabelas continuam disponíveis.

### Demonstração, custos e fechamento

Slides 22–23: elevar a carga, observar latência, saturação e qual peça limita o sistema. Os Labs com os mesmos controles mostram que aumentar APIs não resolve um banco compartilhado limitante. As saídas dos motores são estimativas de modelo; P95 de produção exige instrumentação e teste reais.

Slide 24: comparar **compute, storage, egress e CDN**, além do esforço de operação, em AWS, GCP, Azure e Alibaba Cloud. As marcas são alternativas; não são serviços simultâneos nem preços fixos. Campos de custo do Build Arch são didáticos.

Slide 25: arquitetura evolui com o problema, segurança acompanha cada peça e operação precisa de medição e caminho de volta. A [correspondência dos 25 slides](../arquitetura/04-correspondencia-palestra.md) permite conferir a cobertura com a chefia. O [roteiro curto opcional](05-roteiro-curto-opcional.md) mantém as alternativas de 10/5 min, sem determinar o conteúdo do principal.
