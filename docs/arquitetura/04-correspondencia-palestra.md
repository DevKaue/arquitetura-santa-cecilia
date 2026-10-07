# Correspondência entre a palestra e o Build Arch

Os 25 slides do PPT e as 25 páginas do PDF foram comparados. A extração mostrou diferenças de quebra de palavras e ligaduras; os temas, exemplos e a sequência coincidem. As fontes originais permanecem intactas, fora do repositório público. Hashes e cobertura por slide estão no [registro de alinhamento](../validacao/alinhamento-palestra.json).

O principal atual é **v22**, com **23 blocos e 40 relações**, organizado por camadas e jornadas. O conteúdo técnico da referência **v19** permanece igual. A correspondência abaixo identifica funções do material original e complementos de implementação. Não significa que os slides comprovam a infraestrutura ou os resultados de produção.

| Slide / página | Conteúdo original | Representação no Build Arch |
|---|---|---|
| 1 | Tema e estudo de caso | Título e 8 peças preservados como tema; nome do projeto continua Arquitetura Santa Cecília. |
| 2 | Roteiro da palestra | Problema, conceitos, construção, demonstração e custos aparecem no roteiro de apoio. |
| 3 | Caso global, pico 10x e perfil 95/5 | Milhões de visitas/dia é contexto; nenhum req/min fixado pelo slide. |
| 4 | Perguntas de negócio | Origem, pico, criticidade e atraso tolerado descritos antes das peças. |
| 5 | Tudo numa caixa só | v12. Estado inicial sem redundância preservado em revisão própria. |
| 6 | Latência e throughput | Unidades e significado separados; números do modelo não são medição real. |
| 7 | Disponibilidade e custo | 99%, 99,9%, 99,99%, 99,999% permanecem no material; nenhuma meta extra imposta. |
| 8 | Escala vertical e horizontal | v15. App 1/2/3 na evolução; grupos com 3 instâncias no principal. |
| 9 | Cache | v16. Absorção de leituras e diferença entre HIT e MISS. |
| 10 | Balanceamento | v14. Distribuição e exclusão de instância sem resposta. |
| 11 | Consistência forte e eventual | v17. Compra usa fonte da verdade; catálogo aceita propagação. |
| 12 | Timeout, retry e circuit breaker | Descritos nas dependências; não apresentados como serviços novos. |
| 13 | Cliente, DNS e CDN | v13. Relações DNS/HTTPS distintas; 90% conteúdo estável preservado sem converter em HIT. |
| 14 | Load Balancer e TLS | v14. Terminação e nova sessão TLS explicam os dois trechos HTTPS. |
| 15 | Múltiplas instâncias e autorização | v15. 3 caixas explícitas no estágio; validação antes do domínio. |
| 16 | Cache e proteção dos dados | v16. Pagamento/documentos fora do cache; TTL pessoal curto. |
| 17 | Writer e réplicas | v17. Duas réplicas separadas; repouso criptografado e menor privilégio. |
| 18 | Assíncrono, observabilidade e multi-região | v18. 50 mil mensagens/h, 3→20 workers, aviso 3 min, 40/220 ms preservados como exemplos do slide. |
| 19 | Arquitetura de referência | v19. Todas as funções da figura representadas; duas réplicas e tracing retomam os slides 17–18. |
| 20 | Deploy gradual e rollback | v19. Fração do tráfego/região; métricas orientam retorno. |
| 21 | Pico além do planejado | v19. Rate limiting, sala de espera, modo degradado, teto e alarme. |
| 22 | Carga ao vivo | v19. Mapa mostra as peças; Labs demonstram causalidade com controles iguais. |
| 23 | Gargalo orienta investimento | v19. Comparação dos Labs 01/02/03 preservada. |
| 24 | Compute, storage, egress e CDN | v19. AWS, GCP, Azure e Alibaba no guia; preços fixos não adicionados. |
| 25 | Evolução, segurança e caminho de volta | v19. Histórico e controles demonstram fechamento sem mudar as fontes. |

## Critério para as conexões

DNS e autenticação representam resolução/configuração, não proxies HTTP em série. Orquestração, autoscaler, telemetria e CI/CD são relações de controle/operação. A/B são destinos alternativos de leitura. Replicação regional não declara active-active. Checkout→fila representa trabalho pós-compra; o mecanismo confiável de publicação fica no aprofundamento.

## Detalhes de implementação mantidos como apoio

A v9 conserva outbox/relay/DLQ, provedor de pagamento e metas de recuperação propostas antes desta revisão. O schema de oito tabelas, os manifests e as notas de idempotência continuam disponíveis. Esses detalhes não são atribuídos aos slides. 2.000 req/min, banco 3.000/20.000 e hipóteses de custo/capacidade são parâmetros dos Labs/modelo.

## Três distinções para a explicação

O slide 14 menciona terminação TLS e HTTPS em todos os trechos: a entrada encerra uma sessão e abre outra protegida. O slide 18 permite baixa assíncrona, enquanto os slides 4/11/17 exigem estoque correto na compra: reserva antes de confirmar, baixa operacional depois. O slide 22 fala em P95: saídas heurísticas do Build Arch não são percentis medidos em produção. As fontes não foram reescritas.
