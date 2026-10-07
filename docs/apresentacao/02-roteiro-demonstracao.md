# Arquitetura Santa Cecília
## Roteiro enxuto da demonstração

**Palestra completa: 40 minutos. Demonstração no Build Arch: 10 minutos.** Se o tempo apertar, usar a versão de 5 minutos ao fim deste roteiro. O foco é conectar as decisões dos slides ao desenho; a configuração da ferramenta fica pronta no ensaio.

### Distribuição sugerida dos 40 minutos

| Tempo da palestra | Conteúdo |
|---|---|
| 0–5 min | Problema, contexto e premissas |
| 5–15 min | Escalabilidade, consistência e resiliência |
| 15–23 min | Evolução da arquitetura, segurança e operação |
| 23–33 min | Demonstração de 10 min no Build Arch |
| 33–36 min | Decisões finais e conclusão |
| 36–40 min | Perguntas |

### Preparação antes de entrar em cena

Abrir **Arquitetura Santa Cecília**, em **Trabalho atual · v10**, e enquadrar o mapa. A visão compacta tem três jornadas. O desenho completo de 19 blocos/25 relações está preservado na **v9**; não é necessário percorrer o histórico durante a apresentação.

Ensaiar a importação de **https://github.com/DevKaue/arquitetura-santa-cecilia**, referência **main**. Deixar os Labs 01 e 03 conferidos com os parâmetros do cartão. Conferir **Salvo agora**. Não montar caixas, schema ou conexões ao vivo.

### Sequência principal: 10 minutos

| Tempo da demo | Mostrar | Mensagem |
|---|---|---|
| 0:00–1:00 | Visão geral | Leitura e compra têm necessidades diferentes |
| 1:00–4:00 | Três jornadas | Cache para leitura; writer para reserva; fila para pós-compra |
| 4:00–6:00 | Importar URL do GitHub | Código oferece evidências para revisão |
| 6:00–9:00 | Labs 01 e 03 | Investir no gargalo muda o resultado |
| 9:00–10:00 | Voltar ao mapa e concluir | Medir e validar as decisões no sistema real |

### 0:00–1:00 — Retomar o caso

**Ação:** mostrar a visão compacta, já aberta em 2D.

**Fala:** “Este desenho reúne o caso dos slides. A consulta ao catálogo pode aceitar algum atraso. A compra precisa reservar estoque e evitar repetição de cobrança. O que vem depois da compra pode sair do tempo de resposta.”

Retomar 95% leitura/5% escrita e pico 10x em uma frase. As premissas já foram explicadas nos slides.

### 1:00–4:00 — Explicar três jornadas

**Leitura:** apontar **Catálogo → Cache / Réplicas de leitura**. HIT responde pelo cache; MISS consulta uma réplica. As duas réplicas estão agrupadas para a apresentação.

**Compra:** apontar **Checkout → Writer + standby / Pagamento externo**. Autorização do dono, idempotência e reserva concorrente no writer. A integração de pagamento ocorre fora da transação SQL; timeout exige reconciliação.

**Pós-compra:** apontar **Publicador da outbox → Fila → Notificações / DLQ**. Pedido e intenção de evento são gravados juntos. A notificação de compra confirmada depende de pagamento reconciliado; a entrega pode repetir, por isso o consumidor controla duplicatas.

**Fala:** “Cada caminho tem uma exigência. Distribuímos leitura, protegemos a decisão de compra e deixamos tarefas posteriores em uma fila.”

Mencionar em uma frase que identidade, observabilidade, CI/CD e recuperação também fazem parte da arquitetura e estão detalhadas na v9 e nas notas. Não abrir a modelagem de dados nesta sequência.

### 4:00–6:00 — Trazer a arquitetura do GitHub

**Ação:** **Analisar projeto → GitHub público**. Colar **https://github.com/DevKaue/arquitetura-santa-cecilia**, referência **main**, executar e mostrar o rascunho/evidências. Não editar o mapa inferido durante a palestra.

**Fala:** “O repositório já declara serviços, redes e dependências. A ferramenta extrai evidências, mas precisamos conferir se a relação é inicialização, comunicação ou uma hipótese.”

Aponte apenas um exemplo: o relay depende de PostgreSQL e RabbitMQ. O resultado verificado contém 23 blocos/22 relações para nove serviços do Compose, incluindo imagens, redes e volume. Não significa 23 microsserviços.

Se a análise demorar mais de 45 segundos, continuar a explicação no mapa principal, sem ficar aguardando em silêncio. Se a Internet falhar, mostrar a evidência publicada e esclarecer que a importação ao vivo não terminou.

### 6:00–9:00 — Uma comparação de gargalo

**Ação:** mostrar o resultado do **Lab 01** e do **Lab 03**, com o mesmo cenário ensaiado. Parâmetros: **2.000 req/min**, **Pico**, **4x**, **10 min virtuais**, **Nenhuma falha**. Executar somente se os controles já estiverem prontos; se faltar tempo, usar a tabela do cartão.

| Resultado do modelo | Lab 01 | Lab 03 |
|---|---:|---:|
| Capacidade cadastrada do banco, req/min | 3.000 | 20.000 |
| Latência estimada, ms | 895 | 48 |
| Erro estimado | 68% | 0,05% |

**Fala:** “Mais APIs continuam chegando ao mesmo banco. O Lab 02, que fica como apoio, demonstra isso. A melhoria precisa atingir o limitador, com otimização ou capacidade medida.”

Declarar uma vez: “Esses números são saídas do modelo, não medições de produção.” Não repetir o Lab 02 nem fazer carga ao vivo, falha injetada ou passeio em 3D nesta sequência.

### 9:00–10:00 — Fechar e retornar aos slides

**Ação:** retornar à **Arquitetura Santa Cecília**.

**Fala:** “O desenho organiza as responsabilidades; o repositório ajuda a encontrar evidências; as métricas ajudam a testar hipóteses. O próximo passo real é validar concorrência, segurança, capacidade e recuperação.”

Mencionar que o backup e o repositório guardam as decisões. Retornar à conclusão da palestra. Exportação e navegação de histórico ficam para depois.

### Plano de 5 minutos se o tempo apertar

| Tempo | Ação |
|---|---|
| 0–1 min | Apresentar a visão geral |
| 1–3 min | Explicar leitura, compra e pós-compra |
| 3–4:30 min | Importar do GitHub e apontar uma evidência |
| 4:30–5 min | Concluir e retornar aos slides |

Sem simulação ao vivo. A comparação dos Labs fica em uma resposta à plateia ou no material de apoio. Se a rede não colaborar, manter o mapa já aberto e seguir o fechamento.

### Material mantido para ensaio e perguntas

Os três Labs, o schema de oito tabelas, os relatórios de carga/inferência, as notas técnicas e o mapa completo da v9 continuam nos mesmos arquivos. A carga ao vivo 10x usa 2.000 usuários × 10 ações/min por 30 s; Labs 01/02 deixam aproximadamente 2.650 pendentes após drenagem, e Lab 03 termina sem pendências. Esse exercício fica fora da demo principal.

O diagnóstico e os motores usam heurísticas. A visão compacta agrupa componentes e omite relações de controle/operação para facilitar a leitura; não representa a implantação completa nem um fluxo exato de simulação.
