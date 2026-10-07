# Leitura da arquitetura por camadas

**Projeto principal: Arquitetura Santa Cecília, Trabalho atual v22.** O desenho reúne os 23 blocos e 40 relações da referência completa. As camadas retomam a figura do slide 19. Cache, duas réplicas, tracing e região secundária preservam o que foi explicado nos slides 13–18. A versão em linha reta permanece no histórico como v21.

## Orientação da plateia

Ao abrir o desenho, apontar primeiro o cliente à esquerda. Identificar a borda e a entrada. Mostrar que o centro se divide entre consultas de catálogo e compra. Apontar dados e processamento posterior à direita dessas aplicações. Por fim, localizar observabilidade no lado direito e entrega/orquestração na base.

**Fala de abertura:** “Este é o e-commerce global que acabamos de discutir. Cada peça aqui responde a uma necessidade apresentada nos slides. Vamos acompanhar o que acontece quando alguém consulta um produto e quando confirma uma compra.”

Usar um enquadramento geral para situar a plateia e aproximar o trecho explicado. Os blocos usam o nome da função. A ordem de leitura está neste guia e nas oito peças da palestra. O desenho mantém ramos e camadas próprios de uma arquitetura.

## As oito peças, na ordem dos slides

| Peça da palestra | Onde apontar | Gancho da fala do chefe | Explicação e segurança |
|---|---|---|---|
| 1. Cliente, DNS e CDN (13) | Usuários, DNS acima do cliente, CDN na borda | Clientes estão em vários continentes. 90% do catálogo é conteúdo que não muda a cada visita. | DNS resolve o destino. CDN entrega imagens, CSS e JS perto do usuário. DNS é resolução, não um salto de cada request. Os 90% descrevem conteúdo estável, não uma taxa HIT medida. |
| 2. Load Balancer (14) | Entrada após a CDN | Busca, login e checkout precisam de aplicação viva. | Distribuir requisições dinâmicas entre instâncias saudáveis. Terminar a sessão TLS na entrada e proteger o trecho seguinte com nova sessão TLS. |
| 3. Aplicação em múltiplas instâncias (15) | Catálogo e checkout no centro, identidade acima da entrada | Crescer para os lados com cópias descartáveis e sem estado. | As APIs representam grupos de instâncias. Toda rota valida autenticação/autorização antes do domínio. Token válido exige conferir a permissão para o recurso. A v15 guarda App 1, App 2 e App 3 como nos slides. |
| 4. Cache (16) | Cache no ramo superior de consultas | 95% do tráfego consulta o catálogo. | HIT evita SQL. Em MISS, a aplicação consulta uma réplica saudável. Nunca cachear pagamento/documento. TTL curto no que é pessoal. |
| 5. Escrita e réplicas (17) | Writer na linha da compra, duas réplicas acima | Leitura e escrita crescem em ritmos diferentes. | Compra usa a fonte da verdade. Catálogo/busca aceitam propagação eventual. A/B são alternativas de leitura. Criptografia em repouso e menor privilégio. |
| 6. Fila e worker (18) | Ramo inferior: fila e notificações | Nem todo trabalho precisa terminar antes da resposta. | E-mail e baixa operacional seguem depois. Mensagem contém só o necessário, sem segredo em texto puro. Exemplo original: 50 mil mensagens/h e 3 para 20 workers. A decisão de estoque final continua autoritativa. |
| 7. Observabilidade (18) | Métricas, logs e tracing à direita | Escalar exige saber qual peça está limitando o sistema. | Métricas orientam a decisão, logs investigam e tracing localiza o tempo entre dependências. Mascarar dados sensíveis. Os 3 minutos de antecipação são um exemplo do slide. |
| 8. Multi-região (18) | Região secundária junto da réplica B, ligada ao DNS | Distância aumenta latência e uma região pode cair. | Retomar 40 ms local versus 220 ms cruzando o Atlântico. Planejar roteamento, continuidade e residência de dados. A figura não promete dois writers simultâneos. |

## Duas jornadas para consolidar a compreensão

### Consulta ao catálogo

1. O cliente resolve o domínio. A CDN responde conteúdo estático perto dele.
2. Uma busca dinâmica segue pela borda protegida e pela entrada até uma instância saudável da API de catálogo.
3. A API consulta o cache. Em HIT, responde sem consultar o SQL. Em MISS, escolhe uma réplica saudável e devolve o resultado.
4. Retomar a diferença entre consistência eventual da consulta e confirmação da compra. Uma leitura regional pode reduzir a distância ao cliente.

**Gancho:** “Como a maior parte do tráfego é leitura, protegemos o banco de consultas repetidas e podemos levar as leituras para perto do usuário.”

### Confirmação da compra

1. A requisição dinâmica chega pela mesma entrada à API de checkout. A API valida identidade e permissão antes de tocar no domínio.
2. A decisão de compra e de estoque final usa o banco de escrita. Cache e réplica atrasada não autorizam a venda.
3. O trabalho posterior segue pela fila até o serviço de notificações/worker. A etapa assíncrona de baixa operacional vem depois da decisão autoritativa.
4. Retomar timeout, retry e circuit breaker nas dependências (12). Os detalhes de idempotência, reserva transacional e outbox ficam no aprofundamento já preservado.

**Gancho:** “Os 5% de escrita são menores em volume, mas um erro aqui custa caro. Por isso a compra usa a fonte da verdade e o restante segue quando puder esperar.”

## Referência completa e mundo real

No **slide 19**, retomar WAF/anti-DDoS na borda e autenticação na entrada. Apontar os grupos de catálogo, checkout e notificações, executados em containers. Na base, localizar orquestração e autoscaler. No plano de entrega, apontar análise estática por PR e CI/CD. As relações de controle, telemetria e replicação têm função própria, distinta da jornada de uma requisição.

No **slide 20**, ligar métricas ao CI/CD: versão nova entra numa fração do tráfego ou numa região. Se piorar, retornar à versão anterior. No **slide 21**, voltar à sala de espera junto da entrada, ao rate limiting e ao autoscaler com teto e alarme. Explicar modo degradado como comportamento das APIs: desligar recomendações/avaliações para preservar catálogo e checkout.

Nos **slides 22–23**, usar os Labs para mostrar por que escalar a aplicação não remove um gargalo no banco. A leitura de P95 pertence ao monitoramento real; as saídas heurísticas do Build Arch são estimativas do modelo.

Nos **slides 24–25**, localizar compute nas aplicações/containers, storage no banco, egress entre regiões e CDN na borda. Comparar as categorias e esforço de operação própria/gerenciada sem acrescentar preços fixos. Encerrar com a arquitetura evoluindo conforme o problema, segurança por peça e caminho de volta.

## O que vem das fontes e o que é aprofundamento

O desenho preserva os temas, funções, exemplos e perguntas de segurança dos 25 slides/páginas. Ele reúne a evolução numa visão completa. O [mapa de correspondência](../arquitetura/04-correspondencia-palestra.md) identifica cada trecho. A figura do slide 19 agrupa responsabilidades; as réplicas, tracing e multi-região retomam slides anteriores.

Outbox/DLQ, schema de oito tabelas, parâmetros de capacidade/custo do modelo e controles dos Labs são aprofundamento do exemplo. Permanecem nos materiais e no histórico, identificados como complementos. Não atribuir esses detalhes ao PPT/PDF.

O [roteiro completo](02-roteiro-demonstracao.md), [cartão](03-cartao-apresentador.md) e [perguntas](04-perguntas-respostas.md) apoiam a fala. A [opção de 10/5 minutos](05-roteiro-curto-opcional.md) permanece para o ensaio. A versão em linha reta fica no [guia histórico da v21](06-guia-linear-e-ganchos.md).
