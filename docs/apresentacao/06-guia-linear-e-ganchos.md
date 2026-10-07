# Apresentação linear: ganchos dos slides

**Guia histórico da v21.** Para a apresentação atual, usar o [guia por camadas da v22](07-guia-de-leitura-por-camadas.md). Todos os 23 blocos estão alinhados numa faixa horizontal, numerados da esquerda para a direita. O conteúdo da v19 foi preservado; a v20 guarda a organização que estava no Desktop antes desta mudança.

## Como conduzir a explicação

Retomar o problema apresentado pelo seu chefe e percorrer os números. Em cada bloco: lembrar a necessidade, apontar a função e retomar a pergunta de segurança. Mostrar um trecho de cada vez em zoom legível; arrastar o canvas para continuar a sequência. O enquadramento de todo o mapa serve para mostrar a visão geral.

Os números ordenam a fala. DNS, identidade, telemetria, orquestração e CI/CD não são proxies HTTP em série. As conexões originais foram mantidas; por exemplo, WAF permanece na borda mesmo sendo retomado ao explicar o slide 19. A/B são destinos alternativos de leitura.

| Bloco | Slides do seu chefe | Gancho para retomar | Pergunta que conduz a sua explicação |
|---|---|---|---|
| 01 · Público | 3–4 | O caso atende clientes de vários países e fusos, com 95% leitura e pico 10x. | De onde vem o cliente, qual é o pico e o que não pode falhar? |
| 02 · DNS | 13 | Antes de acessar a loja, o cliente precisa resolver o domínio. | Como encontrar o destino da loja e orientar a região? |
| 03 · CDN | 13 | O conteúdo estável pode ficar perto de quem acessa. | Como entregar imagem, CSS e JS sem levar tudo ao backend? |
| 04 · Entrada | 10, 14 | As requisições dinâmicas precisam de aplicação viva e saudável. | Quem distribui o tráfego e protege os trechos com TLS? |
| 05 · Catálogo | 8, 15 | A aplicação cresce adicionando cópias sem estado local. | Como atender muitas consultas sem prender o usuário a uma instância? |
| 06 · Checkout | 3–4, 15 | Cada erro de compra pode duplicar pedido, cobrança ou afetar estoque. | Qual parte do domínio exige validação antes de confirmar a compra? |
| 07 · Identidade | 15, 19 | Toda rota precisa conferir identidade e permissão antes do domínio. | O cliente autenticado pode acessar este pedido específico? |
| 08 · Cache | 9, 16 | As consultas ao mesmo catálogo se repetem e dominam o tráfego. | Como responder consultas quentes e proteger dados sensíveis? |
| 09 · Writer | 11, 17 | A tela pode aceitar atraso, mas a decisão da compra exige a fonte da verdade. | Onde validar e reservar o estoque final? |
| 10 · Leitura A | 17 | Leitura e escrita têm ritmos diferentes no perfil 95/5. | Para onde vai uma consulta quando o cache não responde? |
| 11 · Leitura B | 17–18 | Mais um destino de leitura distribui consultas e pode ficar perto do cliente. | Como usar outra réplica saudável sem criar outro writer? |
| 12 · Fila | 18 | Nem todo trabalho precisa terminar antes da resposta da compra. | Como absorver o pico e guardar tarefas posteriores com payload mínimo? |
| 13 · Worker | 18–19 | E-mail e baixa operacional podem seguir depois da reserva. | Como processar a fila e crescer de 3 para 20 workers? |
| 14 · Métricas | 6–7, 18, 22–23 | Não se escolhe a peça a escalar sem observar o limitador. | Qual componente satura e como latência, erro e capacidade mudam? |
| 15 · Logs | 18–19 | O incidente exige registros reunidos de várias instâncias. | Como investigar sem expor senha, cartão ou dados pessoais? |
| 16 · Tracing | 18 | Uma requisição atravessa componentes e dependências. | Onde ela gastou tempo e onde a falha começou? |
| 17 · Região | 18 | Clientes distantes precisam de proximidade e uma região pode falhar. | Como explicar 40 ms versus 220 ms e planejar continuidade? |
| 18 · WAF | 19 | A referência final protege a borda contra tráfego malicioso. | Como conter ataque e DDoS sem substituir autorização da API? |
| 19 · Containers | 19 | O desenho reúne aplicações em containers, em Kubernetes ou equivalente. | Quem executa e recupera as cópias da aplicação? |
| 20 · Autoscaler | 18–19, 21 | CPU e fila orientam crescimento, mas custo e dependências têm limites. | Quando aumentar réplicas, até qual teto e quando alertar uma pessoa? |
| 21 · Análise PR | 19 | Qualidade acompanha cada alteração antes de chegar ao público. | O que conferir automaticamente em cada pull request? |
| 22 · Canary | 19–20 | Versão nova entra em parte do tráfego e precisa de caminho de volta. | Como observar a mudança e retornar quando as métricas pioram? |
| 23 · Espera | 21 | O pico extremo pode ultrapassar a capacidade planejada. | Como controlar entrada e preservar catálogo/checkout em modo degradado? |

## Fechamento: custos e evolução — slides 24–25

Voltar aos blocos já percorridos para localizar compute nos containers, storage no banco, egress entre regiões e CDN na borda. Comparar esforço de operação própria/gerenciada sem acrescentar preços fixos. Encerrar com evolução conforme o problema, segurança por peça e medição com caminho de volta.

A ligação com carga/gargalo dos slides 22–23 está em 14 · Métricas e nos três Labs preservados. O [roteiro completo](02-roteiro-demonstracao.md) e a [correspondência dos 25 slides](../arquitetura/04-correspondencia-palestra.md) permanecem como referência; as opções de [10/5 min](05-roteiro-curto-opcional.md) ficam para o ensaio.
