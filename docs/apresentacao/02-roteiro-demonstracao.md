# Arquitetura Santa Cecília
## Roteiro da demonstração no Build Arch

**Duração:** 25 minutos. **Formato:** demonstração guiada, com importação por URL do GitHub no roteiro principal.  
**Resultado esperado:** a plateia explica por que a arquitetura evolui e por que escalar a API pode manter o mesmo gargalo.

### Preparação do apresentador

1. Abrir **Arquitetura Santa Cecília** no Build Arch Desktop, em **Trabalho atual · v9**. Conferir **Salvo agora** e o enquadramento do canvas.
2. Conferir os projetos **Santa Cecília | Lab 01 | Inicial: banco limita**, **Santa Cecília | Lab 02 | Escalar a API não resolve** e **Santa Cecília | Lab 03 | Capacidade no gargalo**.
3. Deixar disponível a URL **https://github.com/DevKaue/arquitetura-santa-cecilia** e a referência **main**.
4. Ensaiar uma importação pelo painel **Analisar projeto**, usando **GitHub público**. A demonstração usa essa URL; backups ficam como recuperação do material.
5. Abrir o cartão do apresentador. Não alterar blocos durante uma execução de carga: a edição limpa a execução.

### Visão do tempo

| Minutos | Etapa | Mensagem |
|---|---|---|
| 0–2 | Problema | Leitura e compra têm exigências diferentes |
| 2–6 | Evolução do desenho | Cada componente responde a uma necessidade |
| 6–9 | Compra e pós-compra | Transação local e integração externa exigem controles distintos |
| 9–15 | Três laboratórios | Mais APIs não corrigem um banco limitante |
| 15–18 | Pico 10x | Pendência mostra acúmulo de trabalho |
| 18–22 | Importar do GitHub | Código produz evidências; arquitetura exige revisão |
| 22–25 | Falha, decisão e exportação | Medir, conter impacto e registrar a decisão |

### 0:00–2:00 — Abrir o problema

**Ação no Desktop:** mostrar o projeto completo em 2D e apontar usuários, catálogo e checkout. Relacionar com os slides 3–4.

**Fala sugerida:** “A maioria das pessoas consulta produtos. Uma parte menor compra, mas uma compra sem estoque ou uma cobrança duplicada custa muito mais caro. Vamos acompanhar o que pode aceitar atraso e o que exige uma decisão confiável.”

**Mostrar:** 2.000 req/min normal, 20.000 no pico e perfil 95/5. Explicar que são premissas do exercício. Perguntar: “Qual dependência vocês investigariam primeiro durante o pico?”

**Transição:** “A arquitetura cresce quando aparece uma necessidade. Vamos ver a sequência.”

### 2:00–6:00 — Percorrer a evolução

**Ação no Desktop:** usar **Versão da arquitetura** para mostrar brevemente as etapas anteriores; retornar a **Trabalho atual · v9**. Relacionar com os slides 13–19.

| Apontar | Explicação principal |
|---|---|
| DNS e CDN/WAF | DNS resolve o destino; CDN aproxima conteúdo público; WAF reduz ataques na borda |
| Load Balancer e APIs | Entrada distribui chamadas; instâncias stateless podem crescer |
| Redis e réplicas A/B | HIT responde pelo cache; MISS escolhe uma réplica; leitura pode atrasar |
| Principal + standby | Existe um writer; standby protege contra falha, sem duplicar escrita |
| Outbox, relay, fila e worker | Trabalho posterior à compra segue por entrega assíncrona |
| Observabilidade, CI/CD e DR | Métricas orientam operação; entrega gradual contém regressão; recuperação precisa de ensaio |

**Fala sugerida:** “As caixas mostram responsabilidades. Começar com um monólito modular pode ser adequado; separar implantação passa a fazer sentido quando volume, equipe e isolamento de falhas justificam o custo.”

**Atenção:** DNS, replicação, telemetria e deploy são relações lógicas. O mapa completo não deve ser usado como uma cadeia de processamento de cada requisição. Custo e disponibilidade do painel usam hipóteses.

### 6:00–9:00 — Explicar a compra correta

**Ação no Desktop:** apontar **06 API Checkout**, **10 Principal + standby**, **18 Publicador da outbox**, **11 Eventos pós-compra**, **12 Worker notificações** e **19 Mensagens para análise**. Abrir **Modelagem de dados** no banco principal.

**Sequência para explicar:**

1. Validar identidade e autorizar o dono do pedido. Conferir chave de idempotência e hash da solicitação.
2. Reservar estoque com atualização condicional; gravar pedido, itens e evento de outbox na mesma transação.
3. Fazer commit. Chamar pagamento externo com idempotência, fora da transação SQL.
4. Reconciliar a confirmação. Em nova transação, confirmar a compra e gravar o evento `purchase_confirmed`.
5. O relay publica após commit, aguarda confirmação do broker e marca a publicação. Uma queda entre publicação e marcação pode gerar duplicata.
6. O consumidor controla o efeito pelo evento e confirma a mensagem após o resultado durável. Tentativas esgotadas vão para a DLQ, com análise e reprocessamento controlado.

**Mostrar no schema:** `orders.owner_subject`, `idempotency_key`, `request_hash`; `reservations.expires_at`; `outbox`; chave composta de `processed_events`.

**Fala sugerida:** “A tela pode exibir estoque atrasado. A decisão de reservar precisa vencer a concorrência no writer. A outbox mantém o pedido e a intenção de publicar juntos; a entrega ainda pode repetir.”

### 9:00–15:00 — Comparar os três laboratórios

**Configuração comum:** **Simular arquitetura** → carga inicial **2.000 req/min** → perfil **Pico** → **4,0x** → duração **10 min** → **Nenhuma falha** → **Executar simulação**. A duração é virtual.

| Projeto | Ação | O que interpretar |
|---|---|---|
| Lab 01 | Executar e apontar o primeiro gargalo | Banco transacional limita o fluxo |
| Lab 02 | Repetir sem mudar os parâmetros | API cresce de 1 para 6 instâncias; banco continua igual |
| Lab 03 | Repetir novamente | Capacidade cadastrada do banco aumenta; o limitador recebe a mudança |

| Resultado do mesmo pico | Lab 01 | Lab 02 | Lab 03 |
|---|---:|---:|---:|
| Instâncias de API | 1 | 6 | 6 |
| Capacidade do banco, req/min | 3.000 | 3.000 | 20.000 |
| Latência estimada, ms | 895 | 895 | 48 |
| Erro estimado | 68% | 68% | 0,05% |

**Fala sugerida:** “Mais cópias da API continuam chegando ao mesmo banco. Primeiro medimos o limitador; depois decidimos entre otimizar queries e índices, controlar concorrência ou aumentar a capacidade necessária.”

**Limite a declarar uma vez:** latência e erro são heurísticas do Build Arch. O Lab 03 representa uma capacidade informada; não prova que adicionar réplica de leitura acelera escrita.

### 15:00–18:00 — Mostrar a campanha 10x

**Ação no Desktop:** no Lab 01, abrir **Teste de carga ao vivo**. Usar entrada **Usuários**, **200 usuários**, **10 ações/min**, **30 segundos**, sem falha. Iniciar e mostrar a base de 2.000 req/min.

Limpar a execução. Mudar apenas para **2.000 usuários**, mantendo **10 ações/min** e **30 s**: são 20.000 req/min. Mostrar a fila no banco. No Lab 03, repetir o pico com os mesmos valores.

**Resultado:** 10.000 requisições são geradas. Labs 01/02 deixam aproximadamente 2.650 pendentes após a drenagem máxima; Lab 03 conclui sem pendências em 33 segundos virtuais. Pendência é acúmulo de trabalho, não comprovação de perda de pedido.

**Fala sugerida:** “A fila mostra que a entrada está maior que a capacidade de processamento. Escalar precisa respeitar o banco e o orçamento.”

**Limite do motor:** o temporal permite até 4x; a carga ao vivo demonstra 10x pelos usuários. Os motores têm cálculos diferentes. Ramificações da carga ao vivo dividem tráfego igualmente; por isso usamos os Labs lineares.

### 18:00–22:00 — Importar a arquitetura do GitHub

**URL:** https://github.com/DevKaue/arquitetura-santa-cecilia  
**Referência:** main

1. Abrir **Analisar projeto** no Desktop e selecionar **GitHub público**.
2. Colar a URL raiz do repositório. Informar **main** no campo de referência, se exibido.
3. Executar a análise. Mostrar as evidências de `docker-compose.yml`, redes, volume e Dockerfiles.
4. Apontar o relay dependendo de PostgreSQL e RabbitMQ, e o checkout dependendo do PostgreSQL.
5. Abrir a arquitetura gerada como outro projeto. Comparar com o desenho revisado e retornar à **Arquitetura Santa Cecília**.

**Fala sugerida:** “O repositório revela serviços e dependências declaradas. Precisamos conferir se cada relação é inicialização, comunicação ou uma hipótese. O código ajuda a começar; a decisão de arquitetura vem da revisão.”

**Resultado verificado pelo motor:** nove serviços do Compose geraram 23 blocos e 22 relações. O mapa inclui redes, imagens, volume e abstrações de software; não representa 23 microsserviços. `depends_on` não prova uma chamada de negócio nem garante prontidão sem uma condição adequada.

**Se a rede falhar:** usar os backups para continuar a explicação e mostrar as evidências registradas em `docs/validacao/inferencia-verificada.json`. Deixar claro que a importação por URL não foi realizada naquele momento; retomar o teste após restabelecer a rede.

### 22:00–25:00 — Falha, decisão e registro

**Ação no Desktop:** no Lab 03, injetar falha do **Banco transacional**. Explicar que o controle derruba o bloco inteiro; não testa failover de uma réplica PostgreSQL. Retornar ao mapa completo.

Discutir brevemente pagamento lento, retry limitado, DLQ e recuperação. O catálogo pode continuar quando uma integração de pagamento está indisponível. Timeout externo mantém resultado desconhecido até consulta ou reconciliação. RPO ≤ 5 min e RTO ≤ 30 min são metas propostas, que exigem ensaio.

**Fechamento sugerido:** “Cada decisão resolve um problema e traz um custo. O próximo passo é medir o sistema real, testar concorrência e falhas e confirmar se as premissas atendem ao negócio.”

Mostrar **Arquivo → Salvar backup**. Uma nova decisão merece revisão e exportação; os arquivos publicados em `buildarch/` permitem abrir o material em outra máquina.

### Adaptação para 20 ou 30 minutos

**20 min:** reduzir evolução do mapa para 3 min; comparar configuração do Lab 02 sem repetir a execução inteira; explicar apenas quatro tabelas na compra. Manter a importação do GitHub e os dois cenários de carga principais.

**30 min:** manter o roteiro de 25 min e reservar 5 min para perguntas sobre idempotência, consistência, redundância e recuperação. Usar o caderno de perguntas como apoio.

### Ensaio e limites do diagnóstico

O diagnóstico pode apontar redundância insuficiente em cada réplica A/B isolada. A redundância de leitura depende do conjunto e da seleção de destino saudável pela API. Explique o limite da heurística. Não use pontuação do painel como certificação de segurança, disponibilidade ou custo.

Ensaie com a versão instalada do Desktop, confira o resultado da importação da URL e os parâmetros dos Labs. Após alterações, aguarde **Salvo agora**. O código de referência usa dados sintéticos; o schema e o mapa descrevem controles que precisam de implementação e teste em um sistema real.
