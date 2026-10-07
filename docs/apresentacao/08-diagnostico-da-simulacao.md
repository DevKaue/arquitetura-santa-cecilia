# Diagnóstico da carga e preparação da demonstração

## Resultado da investigação

O Laboratório de carga rejeita o mapa principal v22 antes de gerar requisições. A mensagem observada no Desktop e reproduzida no motor é: **“Há um ciclo no caminho da carga. Crie um fluxo sem retorno para esta simulação.”** O mesmo acontece com apenas um usuário. O volume de 10.000 usuários da captura não é a causa dessa rejeição.

O desenho completo representa tráfego, resolução DNS, controle de orquestração, telemetria, entrega e replicação. O motor de carga percorre todas as conexões alcançáveis a partir do bloco de entrada. Ele exige um grafo dirigido sem ciclos e não usa a descrição/protocolo da conexão para separar essas funções. Relações assíncronas também entram nesse percurso.

Um ciclo concreto do projeto é:

**API de catálogo → Métricas/painel → Autoscaler → Containers → API de catálogo.**

Esse retorno descreve o acompanhamento e ajuste das instâncias. Ele não significa que a requisição do comprador passa pelo autoscaler. Outro ciclo atravessa checkout, writer, região secundária e orquestração. Os [resultados da investigação](../validacao/diagnostico-carga.json) registram quatro exemplos.

**Conclusão:** a restrição do motor é explícita e a validação está funcionando conforme o código. O mapa completo é incompatível com esse modo de carga. Isso não demonstra uma falha de capacidade do e-commerce nem um defeito exclusivo do Windows. A preparação anterior deveria ter validado a carga ao vivo do principal, além dos três Labs.

## Procedimento para a palestra

Manter **Arquitetura Santa Cecília v22** como desenho para explicar as camadas, as oito peças e as jornadas. Para colocar o exemplo sob carga nos slides 22–23, selecionar os três Labs pelo seletor de projetos do Desktop. Eles já estão salvos e têm um caminho dirigido com quatro blocos e três conexões.

1. Selecionar **Santa Cecília | Lab 01 | Inicial: banco limita**.
2. Abrir **Teste de carga ao vivo / Laboratório de carga**. Usar **2.000 usuários virtuais**, **10 ações/min por usuário**, **30 segundos de geração**, entrada **Usuários** e **Sem falha forçada**. Usar os mesmos parâmetros nos três Labs.
3. Iniciar a carga e acompanhar o banco acumulando pendências. Ao final do limite de drenagem, ficam aproximadamente **2.650**. A geração termina em 30 segundos, mas a execução pode seguir por mais 120 segundos virtuais para drenar.
4. Selecionar **Lab 02 | Escalar a API não resolve** e repetir. Seis instâncias de API chegam ao mesmo banco. O resultado permanece aproximadamente **2.650 pendentes**.
5. Selecionar **Lab 03 | Capacidade no gargalo** e repetir. O banco reforçado permite concluir **10.000 requisições**, sem pendências, em **33 segundos virtuais**.
6. Voltar ao principal e localizar a função do banco nesse desenho. Retomar a fala: “O primeiro componente que satura orienta o investimento.”

| Motor de carga, controles iguais | Lab 01 | Lab 02 | Lab 03 |
|---|---:|---:|---:|
| Instâncias de API | 1 | 6 | 6 |
| Capacidade de banco, req/min por instância | 3.000 | 3.000 | 20.000 |
| Geradas | 10.000 | 10.000 | 10.000 |
| Concluídas | 7.350 | 7.350 | 10.000 |
| Pendentes no término | 2.650 | 2.650 | 0 |
| Duração virtual total | 150 s | 150 s | 33 s |

**Fala de transição:** “O desenho reúne todos os planos da arquitetura. Para isolar a relação entre carga, aplicação e banco, vamos usar o laboratório dessa jornada. Assim, mudamos uma capacidade por vez e vemos o efeito.”

Reprodução 4× acelera o acompanhamento na tela, mantendo os segundos virtuais do modelo. Os resultados foram reproduzidos executando o motor atual com os arquivos salvos no Desktop. Eles não são um registro de cliques na interface nem um teste real de produção.

## Dois simuladores com premissas diferentes

O botão **Simular arquitetura** executa uma estimativa temporal. O **Laboratório de carga** acompanha lotes por segundo virtual e recusa ciclos no percurso. São cálculos distintos. No laboratório, cada conexão representa um segundo virtual, as rotas dividem o volume igualmente e as latências cadastradas não são emuladas.

Por isso, remover apenas as conexões de controle do principal elimina a rejeição, mas não transforma o resultado numa simulação fiel de 95/5, de HIT/MISS do cache ou de P95 medido. A investigação testou essa redução como experimento e preservou o principal completo. Os parâmetros dos Labs permanecem exemplos didáticos, separados dos números originais dos slides.

## Possibilidade de usar a versão web

URL: **https://build-arch.vercel.app/app/**. A PWA compartilha a interface e o módulo de carga com o Desktop. Ela é viável como alternativa de acesso, mas a mudança de plataforma mantém a restrição de ciclos.

O código da PWA guarda os projetos em **IndexedDB no navegador**. Isso não sincroniza automaticamente com o arquivo de projetos do Desktop. Para preparar a web, usar **Arquivo → Abrir backup → Abrir como novo projeto** para o principal e os três Labs em [buildarch/](../../buildarch/). Se quiser levar ajustes recentes do Desktop, exportar o backup atual dele. Evitar depender da inferência do GitHub para restaurar posição e histórico: a inferência gera outro rascunho.

Abrir online e conferir os projetos antes da palestra. O aplicativo possui suporte a cache offline pelo service worker, mas isso precisa ser verificado no navegador que será usado. Importação do GitHub e chamadas externas continuam dependendo de rede. Manter os backups disponíveis para contingência.

A investigação permaneceu no Desktop conforme a preferência do apresentador. A interface web abriu e validou a estrutura do backup, mas a importação não foi concluída e a carga na UI web não foi executada. A equivalência do motor e o armazenamento foram conferidos no código, não num teste completo de apresentação web.

## Evolução possível do Build Arch

Para permitir simular um desenho completo, o modelo precisa distinguir a finalidade das relações: tráfego de requisições, controle, telemetria, replicação e entrega. Essa classificação deve persistir no backup e orientar o motor. O simulador deve considerar apenas o fluxo selecionado e explicar quais relações ficaram fora do cálculo. Ciclos reais nesse fluxo ainda exigem tratamento explícito.

Também são necessários pesos/políticas de roteamento para representar 95/5 e HIT/MISS. Esses recursos exigem testes de conservação de volume, rejeição de ciclos de tráfego, isolamento dos planos e compatibilidade com backups antigos. Essa mudança do aplicativo não foi implementada nem publicada durante esta investigação.
