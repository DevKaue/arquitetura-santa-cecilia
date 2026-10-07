# Visão e decisões arquiteturais

## Referência do material original

Principal **v19**: 23 blocos, 40 relações, alinhados aos slides 3–25. [Correspondência completa](04-correspondencia-palestra.md). A duração da fala não determina o conteúdo do mapa.

| Camada | Blocos principais | Pergunta resolvida |
|---|---|---|
| Borda | Usuários, DNS, WAF, CDN | De onde vem o cliente e como atender perto/proteger? |
| Entrada | Gateway/LB, identidade, sala de espera | Como distribuir, autenticar e controlar o pico? |
| Orquestração | Catálogo, checkout, notificações, containers, autoscaler | Como escalar cópias e manter o essencial? |
| Dados | Cache, writer, réplicas A/B, fila | O que pode atrasar e o que precisa da fonte da verdade? |
| Multi-região | Região secundária, DNS, réplica próxima | Como reduzir distância e planejar continuidade? |
| Observabilidade | Métricas, logs, tracing | Qual peça satura e onde o erro começou? |
| Entrega | CI/CD, análise estática, monitoramento | Como lançar para parte do tráfego e voltar? |

## Leitura, compra e trabalho posterior

Catálogo usa cache; MISS escolhe uma réplica saudável. Compra valida identidade/permissão e estoque no writer. Trabalho posterior segue à fila e workers, sem adiar a reserva necessária à venda. As réplicas são destinos alternativos; o mapa não impõe consulta aos dois bancos em cada MISS.

Sala de espera limita acesso em pico; a fila assíncrona guarda tarefas. Circuit breaker, timeout e retry são comportamentos de dependências. Modo degradado desliga recomendações/avaliações para preservar catálogo e checkout.

## Segurança por peça

HTTPS até a borda, entrada e backend; terminação e nova sessão TLS na entrada. Autenticação e autorização antes do domínio. Cache sem pagamento/documentos e TTL curto para informação pessoal. Banco com criptografia em repouso e menor privilégio. Mensagens mínimas, logs mascarados, residência de dados considerada na região.

## Operação e custo

CPU/fila orientam autoscaling; teto e alarme exigem decisão humana quando necessário. Métricas, logs e tracing ajudam a investir no limitador. Canary/rollback usam sinais do monitoramento. Compute, storage, egress e CDN entram na comparação de provedores, junto ao trabalho da equipe. Números do painel são didáticos.

## Aprofundamento preservado

Outbox, DLQ, reserva concorrente e reconciliação são detalhes adicionais de implementação, disponíveis na v9 e nas [notas de checkout/eventos](03-checkout-e-eventos.md). A v10 preserva a visão compacta anterior. v11 guarda o estado do Desktop antes da reorganização. v12–v19 seguem os slides 5 e 13–19.

Um writer e standby não criam múltiplos escritores. O slide 18 não fixa RPO/RTO; definir metas e testar promoção, restauração e roteamento faz parte da implementação. O Compose é um inventário demonstrativo de nove serviços e não implanta toda a referência global.
