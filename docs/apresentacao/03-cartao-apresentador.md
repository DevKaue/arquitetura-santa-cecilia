# Arquitetura Santa Cecília
## Cartão do apresentador

**25 minutos · Build Arch Desktop · projeto final v9**

| Tempo | Tela/ação | Frase-chave |
|---|---|---|
| 0–2 | Arquitetura final | “Leitura e compra têm exigências diferentes.” |
| 2–6 | Histórico → Trabalho atual | “Cada componente entrou para atender uma necessidade.” |
| 6–9 | Checkout, banco, relay e DLQ | “Pedido e intenção de evento nascem na mesma transação.” |
| 9–15 | Labs 01, 02 e 03 | “Mais APIs continuam chegando ao mesmo banco.” |
| 15–18 | Carga ao vivo 10x | “Fila crescente mostra a diferença entre demanda e capacidade.” |
| 18–22 | Analisar projeto → GitHub público | “O código oferece evidências; o mapa precisa de revisão.” |
| 22–25 | Falha e exportação | “Medir, testar falhas e registrar a decisão.” |

### Parâmetros que devem permanecer iguais

**Temporal:** carga 2.000 req/min; Pico; 4x; 10 min virtuais; nenhuma falha.  
**Ao vivo — base:** 200 usuários × 10 ações/min; 30 s.  
**Ao vivo — pico:** 2.000 usuários × 10 ações/min; 30 s.

**Esperado:** Labs 01/02 = 895 ms e 68%; Lab 03 = 48 ms e 0,05% no temporal. Ao vivo no pico: aproximadamente 2.650 pendentes nos Labs 01/02; zero no Lab 03 após drenagem.

### GitHub

**https://github.com/DevKaue/arquitetura-santa-cecilia**  
Referência **main**. Importar como outro projeto. Mostrar Compose → evidência → rascunho → revisão. Retornar ao projeto final antes do fechamento.

### Conferência antes de começar

- Arquitetura final aberta, **Salvo agora**, canvas enquadrado.
- Três Labs conferidos; URL testada no Desktop; Internet disponível.
- Roteiro aberto e backups acessíveis para recuperação.
- Uma frase para declarar o limite: “Os números são saídas do modelo, não medições de produção.”
