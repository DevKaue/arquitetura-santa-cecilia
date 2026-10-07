# Arquitetura Santa Cecília
## Roteiro da demonstração conforme a palestra

O roteiro segue a ordem e o conteúdo do PPT/PDF. **A duração fica a critério de vocês.** Abrir o principal em **Trabalho atual · v22**, conferir **Salvo agora** e enquadrar o canvas. As conexões de DNS, orquestração, telemetria e entrega têm função de controle/operação; não são todas etapas de uma compra.


Para a disposição atual e os ganchos das oito peças, usar o [guia de leitura por camadas](07-guia-de-leitura-por-camadas.md).

### 1. O problema antes do desenho — slides 3–5

**Mostrar:** Usuários globais; depois a revisão **v12**, correspondente ao slide 5.

**Explicar:** clientes em vários fusos, milhões de visitas/dia, pico 10x e perfil 95/5. Listagem tolera atraso; checkout/pagamento têm impacto financeiro. Perguntas de negócio definem localização, capacidade e criticidade.

**Fala:** “Com tudo em um servidor e um banco, consulta e compra disputam os mesmos recursos. Cada peça que vem depois responde a uma necessidade deste caso.”

### 2. Vocabulário que orienta as decisões — slides 6–12

Relacionar latência (tempo de resposta) e throughput (quantidade por unidade de tempo). Mais instâncias aumentam capacidade quando a dependência compartilhada comporta a demanda. Disponibilidade tem custo: o slide 7 compara os quatro níveis de noves, sem escolher um SLO para o caso.

Retomar cache, balanceamento e consistência. Catálogo pode aceitar propagação; a compra usa a fonte da verdade. No inspetor de catálogo/checkout, mostrar **timeout, retry limitado e circuit breaker** como comportamento das dependências.

### 3. Cliente, DNS e CDN — slide 13, v13

**Ação:** abrir a revisão v13. Apontar a consulta DNS e o caminho HTTPS para CDN.

**Fala:** “DNS resolve o domínio. A CDN entrega imagens, CSS e JavaScript perto do usuário. A requisição HTTPS não passa pelo DNS como por um proxy.”

O slide usa **90% de conteúdo estável** para justificar a borda. Não converter esse número em cache HIT medido. Clientes distantes ganham proximidade sem sobrecarregar o backend.

### 4. Load Balancer — slide 14, v14

**Mostrar:** entrada adicionada depois da borda; apontar distribuição e exclusão de instâncias sem resposta.

**Fala:** “O dinâmico vai para uma instância saudável. TLS termina na entrada e uma nova sessão protege o trecho até a aplicação.”

Na referência final, esta peça incorpora gateway e rate limiting. Banco, cache e broker ficam fora do acesso público.

### 5. Aplicação em múltiplas instâncias — slide 15, v15

**Mostrar:** App 1, App 2 e App 3. Cada uma representa uma cópia descartável sem sessão local de usuário.

**Fala:** “Qualquer instância pode atender uma requisição. Para a compra, autenticação e autorização precisam ocorrer antes da regra de negócio.”

Na v19, o slide 19 refina as responsabilidades em API de catálogo, API de checkout e serviço de notificações. Catálogo/checkout continuam com três instâncias no exemplo; não equivalem a apenas uma cópia de cada serviço.

### 6. Cache — slide 16, v16

**Mostrar:** cache adicionado às aplicações. No inspetor, explicar HIT/MISS e dados permitidos.

**Fala:** “Perguntas repetidas sobre catálogo são atendidas em memória. Pagamento e documentos não entram nesse cache; informação pessoal exige TTL curto.”

TTL/invalidação e limite de fallback são políticas de implementação. O slide não determina segundos de TTL nem uma taxa HIT.

### 7. Banco de escrita e réplicas — slide 17, v17

**Mostrar:** writer e **duas réplicas separadas**. Explicar que cada consulta escolhe um destino de leitura, enquanto checkout escreve na fonte da verdade.

**Fala:** “Leitura e escrita crescem conforme necessidades diferentes. A tela pode mostrar um valor atrasado; a decisão de vender precisa validar estoque no banco autoritativo.”

Segurança do slide: criptografia em repouso e usuários de menor privilégio. Um standby de HA não é um segundo writer. O schema de oito tabelas fica como aprofundamento do exemplo.

### 8. Assíncrono, observabilidade e multi-região — slide 18, v18

**Fila e worker:** e-mail e baixa operacional de estoque saem da resposta imediata. A decisão de reserva permanece no checkout, conforme slides 4/11/17. O exemplo da palestra é **50 mil mensagens/h**, com workers de **3 para 20**, por tamanho da fila. Mensagens levam só o necessário, sem segredos.

**Observabilidade:** mostrar métricas, logs e tracing; correlacionar saturação e latência. Logs mascaram dados sensíveis. O aviso **3 min antes do primeiro erro** é um exemplo do slide, sem garantia de antecipação.

**Multi-região:** mostrar DNS geográfico, região secundária e réplica próxima. O caso compara **40 ms local** com **220 ms transatlântico**. Considerar residência de dados. Falha de região exige capacidade de assumir, dados disponíveis e mudança de roteamento; o slide não fixa RPO/RTO.

### 9. Arquitetura de referência completa — slide 19, v22

**Ação:** voltar a **Trabalho atual · v22**. Percorrer as camadas visíveis: borda; entrada/identidade; apps/orquestração/autoscaler; dados; observabilidade; entrega.

**Fala:** “O provedor e os nomes das ferramentas podem mudar. A função de cada camada é a mesma do desenho dos slides.”

Explicar WAF/anti-DDoS, OAuth2/OIDC, containers em Kubernetes ou equivalente, autoscaling por CPU/fila e análise estática a cada PR. Redis/Memcached, SQL e SQS/RabbitMQ/Pub/Sub são alternativas, não escolhas simultâneas obrigatórias.

### 10. Lançar e sobreviver ao pico — slides 20–21

**Mostrar:** CI/CD/rollback, métricas, autoscaler e sala de espera.

Canary recebe uma fração do tráfego ou uma região; se as métricas piorarem, voltar à versão anterior. Em pico extremo, combinar rate limiting, controle de admissão, modo degradado e teto com alarme. Desligar recomendações/avaliações preserva o essencial. **Sala de espera é acesso; fila assíncrona é trabalho.**

### 11. Carga e gargalo — slides 22–23

**Ação:** mostrar as peças do principal e usar os Labs para a comparação controlada. Os motores do Build Arch estimam resultados; o mapa completo inclui planos de controle/replicação que não devem ser interpretados como todos os saltos HTTP.

O Laboratório de carga recusa ciclos no principal v22, pois trata todas as relações como percurso da carga. Para essa etapa, selecionar os Labs. O [diagnóstico e procedimento verificado](08-diagnostico-da-simulacao.md) explicam a restrição e os controles.

Temporal: **2.000 req/min**, **Pico**, **4x**, **10 min virtuais**, **Nenhuma falha**.

| Saída do modelo | Lab 01 | Lab 02 | Lab 03 |
|---|---:|---:|---:|
| Instâncias de API | 1 | 6 | 6 |
| Capacidade de banco cadastrada, req/min | 3.000 | 3.000 | 20.000 |
| Latência estimada, ms | 895 | 895 | 48 |
| Erro estimado | 68% | 68% | 0,05% |

**Fala:** “Mais APIs continuam chegando ao mesmo banco. A peça que limita o sistema orienta o investimento.”

Carga ao vivo 10x, como exercício complementar: **2.000 usuários × 10 ações/min**, **30 s virtuais**. Gera 10.000 requisições; Labs 01/02 deixam aproximadamente 2.650 pendentes no limite de drenagem; Lab 03 termina sem pendências. Esses parâmetros são do nosso exercício, não valores fixados no PPT. Não apresentar a latência temporal como P95 medido.

### 12. Custos e encerramento — slides 24–25

Apontar onde surgem **compute, storage, egress e CDN**. Comparar serviço gerenciado com operação própria, incluindo esforço da equipe. A palestra cita AWS, GCP, Azure e Alibaba Cloud; o mapa permanece independente de provedor. Nenhum preço fixo é estabelecido.

**Fala:** “A arquitetura evolui com o problema. Segurança acompanha cada peça. Em produção, medir e ter caminho de volta fazem parte do desenho.”

### Importação do GitHub como recurso complementar

**Analisar projeto → GitHub público**. URL: **https://github.com/DevKaue/arquitetura-santa-cecilia**, referência **main**. Revisar evidências; o Compose de nove serviços gera 23 blocos/22 relações no motor verificado. A inferência inclui imagens, redes e abstrações; não equivale a 23 microsserviços. É um recurso adicional da nossa demonstração, não uma etapa descrita nos slides.

Se a rede falhar, usar o principal já salvo e os relatórios locais. O [roteiro de 10/5 min](05-roteiro-curto-opcional.md) continua como opção de condução, sem reduzir o conteúdo preparado.
