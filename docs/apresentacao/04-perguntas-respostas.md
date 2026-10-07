# Arquitetura Santa Cecília
## Perguntas e respostas para discussão

Usar as respostas breves durante as perguntas e o aprofundamento conforme o interesse da plateia. A numeração segue os temas discutidos na palestra; questões de implementação complementam os slides e estão identificadas como apoio.

### A. Escolha e evolução da arquitetura

#### 1. É necessário começar com microsserviços?

**Resposta breve:** não. Um monólito modular pode atender a fase inicial com menos custo operacional.

**Aprofundamento:** separar implantação faz sentido quando volume, autonomia da equipe, frequência de mudança ou isolamento de falhas justificam observabilidade, comunicação distribuída e operação adicionais. O mapa ensina responsabilidades; não impõe um estilo único.

#### 2. Como decidir o que escalar?

**Resposta breve:** medir a dependência limitante antes de aumentar instâncias.

**Aprofundamento:** olhar saturação, filas, latência medida, erros, queries, índices, pool de conexões e concorrência. No Lab 02, seis APIs continuam chegando ao mesmo banco. O Lab 03 altera a capacidade cadastrada no limitador; a intervenção real precisa de medição.

#### 3. Qual o custo dessa arquitetura?

**Resposta breve:** o painel apresenta valores didáticos; um orçamento real depende do uso e do provedor.

**Aprofundamento:** região, tráfego de saída, requests, processamento, armazenamento, observabilidade, suporte e operação precisam entrar na conta. Autoscaling exige teto e proteção das dependências compartilhadas.

### B. Dados, cache e compra

#### 4. O que significa o perfil 95/5?

**Resposta breve:** é a hipótese de negócio: 95% das chamadas leem e 5% escrevem.

**Aprofundamento:** no pico ilustrativo de 20.000 req/min dos Labs, seriam 19.000 leituras e 1.000 escritas. O slide 13 fala em 90% de conteúdo estável. Um HIT de 90% é uma hipótese adicional do exercício e deixa 1.900 leituras chegando ao banco. O motor de ramificações não aplica automaticamente esses percentuais.

#### 5. Como impedir que dois clientes comprem a última unidade?

**Resposta breve:** decidir a reserva no writer com atualização condicional dentro da transação.

**Aprofundamento:** atualizar somente se houver estoque suficiente; fazer rollback de todos os itens se um falhar. Usar ordem estável para itens e tratar deadlock/retry com idempotência. Um teste concorrente deve provar que o saldo não fica negativo.

#### 6. Cache ou réplica podem decidir a reserva?

**Resposta breve:** a tela pode aceitar atraso; a reserva usa o dado autoritativo.

**Aprofundamento:** TTL e replicação podem exibir estado antigo. A API de compra precisa conferir disponibilidade, preço e autorização no domínio apropriado. Falha do cache exige fallback limitado para não provocar avalanche no banco.

#### 7. Standby aumenta a capacidade de escrita?

**Resposta breve:** não. O modelo mantém um writer e um standby para alta disponibilidade.

**Aprofundamento:** réplicas A/B atendem leituras do catálogo com atraso possível. HA, distribuição de leitura e capacidade de escrita são decisões distintas. A promoção deve impedir que o writer antigo continue aceitando escrita.

### C. Resiliência e processamento assíncrono

Outbox e DLQ são aprofundamento de implementação do nosso exemplo; o desenho original apresenta fila e worker.

#### 8. Retry sempre melhora a disponibilidade?

**Resposta breve:** retry sem limite pode aumentar a sobrecarga e repetir efeitos.

**Aprofundamento:** timeout, backoff com jitter, orçamento finito e idempotência são necessários. Em pagamento, timeout significa resultado desconhecido: consultar estado ou reconciliar antes de compensar a reserva.

#### 9. Outbox garante exatamente uma entrega?

**Resposta breve:** não. Ela grava pedido e intenção de publicar na mesma transação local.

**Aprofundamento:** o relay pode publicar, receber confirmação e cair antes de marcar o evento. A repetição exige deduplicação por evento/consumidor. O evento de compra confirmada nasce após reconciliação do pagamento; criar pedido não autoriza enviar confirmação de compra.

#### 10. Como evitar e-mail duplicado?

**Resposta breve:** o efeito externo também precisa de uma política de idempotência.

**Aprofundamento:** gravar `processed_events` não torna atômica a chamada ao serviço de e-mail. Exigir idempotência do provedor ou documentar a tolerância a duplicata e a reconciliação. ACK deve acompanhar a política de efeito durável.

#### 11. Para que serve a DLQ?

**Resposta breve:** retirar mensagens que esgotaram tentativas e permitir investigação e reprocessamento controlado.

**Aprofundamento:** monitorar idade/volume, definir responsável e retenção, corrigir a causa e repetir com deduplicação. DLQ sem processo operacional vira acúmulo de problema.

### D. Segurança, operação e recuperação

#### 12. WAF e token válido bastam para segurança?

**Resposta breve:** não. A aplicação também precisa validar entrada e autorizar cada recurso.

**Aprofundamento:** conferir o dono do pedido, menor privilégio no banco e nos serviços, rede privada para dados/broker, segredos por ambiente e logs sem tokens/cartão. WAF atua na borda; não conhece todas as regras do domínio.

#### 13. Qual a disponibilidade real? E a recuperação de região?

**Resposta breve:** disponibilidade exige medição; RPO/RTO exigem teste de desastre.

**Aprofundamento:** definir SLI, período de observação e SLO. O slide 18 não fixa metas RPO/RTO. Os valores 5/30 min das versões anteriores eram hipóteses extras; definir metas exige ensaio de restore, promoção, fencing e roteamento. CDN mundial não torna o writer active-active nem substitui backup.

### E. Build Arch e repositório

#### 14. Por que a arquitetura inferida é diferente do desenho final?

**Resposta breve:** os manifests revelam recursos e dependências; o desenho final incorpora decisões de negócio e operação.

**Aprofundamento:** a inferência inclui redes, volume, imagens e abstrações com possíveis sobreposições. Revisar evidências e separar inicialização de chamada real. Capacidade, segurança, consistência e fluxo de pagamento não são comprovados por `depends_on`.

#### 15. A nota do diagnóstico e os números da simulação garantem o sistema?

**Resposta breve:** são indicadores do modelo, úteis para discutir hipóteses.

**Aprofundamento:** o diagnóstico examina blocos; a redundância A/B depende do roteamento saudável do conjunto. O simulador temporal e a carga ao vivo usam motores distintos. Um sistema real precisa de benchmark, teste concorrente, teste de falhas e observação.

#### 16. O repositório implementa uma plataforma de compras completa?

**Resposta breve:** publica o exemplo arquitetural, manifests e endpoints demonstrativos.

**Aprofundamento:** o catálogo é sintético, checkout retorna 501 e relay/worker não processam eventos. O schema explicita invariantes; o comportamento de domínio está descrito nas notas técnicas. O objetivo ao importar do GitHub é revisar evidências de arquitetura.

### F. Correspondência com os slides

#### 17. Onde aparecem as peças da palestra?

**Resposta breve:** todas as funções da referência do slide 19 estão na v19, com réplicas, tracing e região retomando os slides 17–18.

**Aprofundamento:** v12 mostra a caixa única do slide 5; v13–v18 acompanham a construção original. Blocos incluem motivo, segurança e referência; [matriz dos 25 slides](../arquitetura/04-correspondencia-palestra.md) registra a cobertura. Versões anteriores continuam no histórico.

#### 18. Circuit breaker faz o quê?

**Resposta breve:** interrompe temporariamente chamadas a uma dependência que falha, contendo o problema.

**Aprofundamento:** slide 12 combina timeout, retry e circuit breaker. Tentativas precisam de limite e idempotência quando repetem efeitos. A política pertence ao código/proxy da dependência; o desenho não inventa um serviço separado para ela.

#### 19. Sala de espera é a mesma fila do worker?

**Resposta breve:** são funções distintas: a primeira controla entrada; a segunda guarda trabalho posterior.

**Aprofundamento:** slide 21 protege o acesso em pico extremo. Slide 18 desacopla e-mail/baixa operacional. Nenhuma substitui planejamento de capacidade.

#### 20. Baixa de estoque pode esperar?

**Resposta breve:** a operação posterior pode esperar; a decisão de vender exige reserva autoritativa.

**Aprofundamento:** slide 18 trata a baixa no processamento assíncrono, enquanto slides 4/11/17 exigem correção no estoque da compra. Reservar no checkout e consolidar a baixa depois mantém as duas ideias. A implementação deve evitar liberar ou vender a mesma unidade duas vezes.

#### 21. Por que comparar gerenciado e operação própria?

**Resposta breve:** custo inclui a equipe que opera o sistema, além da infraestrutura.

**Aprofundamento:** slide 24 compara compute, storage, egress e CDN. AWS, GCP, Azure e Alibaba Cloud são alternativas com pacotes próprios; a palestra evita preços fixos. Disponibilidade, suporte, observabilidade e esforço operacional também influenciam a decisão.
