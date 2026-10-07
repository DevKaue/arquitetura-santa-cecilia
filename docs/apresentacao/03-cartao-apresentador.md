# Arquitetura Santa Cecília
## Cartão do apresentador

**Palestra: 40 min · Demo: 10 min · Plano curto: 5 min · Build Arch Desktop: v10**

| Tempo da demo | Ação | Frase-chave |
|---|---|---|
| 0–1 min | Mapa já aberto | “Leitura e compra têm exigências diferentes.” |
| 1–4 min | Três jornadas | “Cache para leitura, writer para reserva e fila para pós-compra.” |
| 4–6 min | Importar URL do GitHub | “O código oferece evidências; o mapa precisa de revisão.” |
| 6–9 min | Comparar Labs 01/03 | “Mais APIs continuam chegando ao mesmo banco.” |
| 9–10 min | Voltar ao mapa | “Medir, validar e registrar a decisão.” |

### URL pronta para copiar

**https://github.com/DevKaue/arquitetura-santa-cecilia**  
Referência **main**. **Analisar projeto → GitHub público**. Apontar relay → PostgreSQL/RabbitMQ; não editar o mapa inferido. Se demorar mais de 45 s, continuar a explicação no mapa principal.

### Comparação pronta

Temporal: **2.000 req/min · Pico · 4x · 10 min virtuais · Nenhuma falha**.

| Resultado | Lab 01 | Lab 03 |
|---|---:|---:|
| Latência estimada | 895 ms | 48 ms |
| Erro estimado | 68% | 0,05% |

O Lab 02 mantém o resultado do Lab 01 mesmo com seis APIs. Não precisa executar os três. Uma frase sobre o limite: “Os números são saídas do modelo, não medições de produção.”

### Se só houver 5 minutos

Mapa 1 min → três jornadas 2 min → GitHub 1,5 min → fechar 30 s. Omitir simulação. Histórico, schema, carga ao vivo, 3D e exportação ficam fora do roteiro principal.

### Antes de começar

Conferir **Trabalho atual · v10**, **Salvo agora**, enquadramento e importação da URL. Deixar Labs 01/03 ensaiados. Mapa completo na **v9**; laboratórios e notas mantidos para perguntas. Sugestão de orçamento: 26 min de slides/conclusão, 10 min de demo e 4 min de perguntas.
