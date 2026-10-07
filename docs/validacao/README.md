# Validação e limites

| Verificação | Resultado | O que comprova |
|---|---|---|
| PPT/PDF originais | 25 slides/páginas comparados; cobertura registrada | Correspondência temática e exemplos do material fornecido |
| Parser oficial do Build Arch | Quatro backups aceitos; 22 revisões do principal | Compatibilidade estrutural dos arquivos |
| Validador do schema | Oito tabelas; sem achados críticos/avisos | Estrutura de tabelas, FKs e índices |
| Motor temporal | Labs 01/02/03 com mesmos parâmetros | Comparação do modelo, sem benchmark real |
| Motor ao vivo | Pico 10x e pendências conferidos | Cálculo virtual de processamento/drenagem |
| Carga no principal v22 | Recusada por ciclo mesmo com 1 usuário | Restrição do motor ao atravessar todos os planos de relações |
| Compose | YAML válido, nove serviços | Sintaxe e inventário declarados |
| Inferência estática | 23 blocos e 22 relações | Sinais extraídos pelo motor, sujeitos a revisão |
| Endpoints locais | Catálogo sintético; checkout 501 | Contratos demonstrativos dos servidores |

[Resultados de carga](resultados-verificados.json) e [relatório de inferência](inferencia-verificada.json).

O Compose não foi executado com containers nesta preparação. Não foram realizados benchmark HTTP, failover de PostgreSQL, recuperação de região ou validação do workflow de pagamento. Segredos, segurança de produção e disponibilidade precisam de implementação e teste.

Capacidade, custo e disponibilidade cadastrados no Build Arch são premissas. Relações de inicialização, controle e telemetria não são todas saltos de uma requisição. A simulação temporal e a carga ao vivo têm cálculos diferentes.

[Registro de alinhamento às fontes](alinhamento-palestra.json) e [matriz de correspondência](../arquitetura/04-correspondencia-palestra.md).

[Diagnóstico da carga](diagnostico-carga.json): projetos salvos no Desktop executados no motor atual, ciclos identificados e resultados dos três Labs. A carga via UI web não foi executada.

[Layout por camadas v22](layout-camadas.json): posições e agrupamentos conferidos, com ramos de leitura/compra separados. O [layout linear v21](layout-linear.json) permanece como histórico. Conteúdo técnico, relações da v19 e versões anteriores foram preservados. Os hashes do PDF/PPT originais foram reconferidos nesta revisão.
