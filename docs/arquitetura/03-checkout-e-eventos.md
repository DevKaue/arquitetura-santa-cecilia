# Checkout, reservas e eventos

**Aprofundamento do exemplo:** estes detalhes de implementação complementam a palestra; não fazem parte da figura original do slide 19. A referência por slide está na [matriz de correspondência](04-correspondencia-palestra.md).

O código HTTP demonstra contratos de entrada; checkout responde 501. Esta nota descreve o comportamento que uma implementação transacional precisaria cumprir.

## 1. Entrada e repetição segura

Autenticar e autorizar o dono. Validar quantidade, payload e chave de idempotência. Usar preços/regras do servidor. Neste schema, a chave é globalmente única; comparar `owner_subject` e `request_hash` antes de devolver um pedido existente. Mesma chave com solicitação diferente exige conflito controlado.

## 2. Reserva local

Iniciar transação, inserir pedido pendente e reservar cada item:

```sql
UPDATE inventory
SET available = available - $1, version = version + 1
WHERE product_id = $2 AND available >= $1
RETURNING available;
```

Sem linha atualizada, abortar a compra. Para vários itens, usar ordem estável, fazer rollback do conjunto e tratar deadlock/retry com idempotência. Gravar itens, reservas e intenção de evento na mesma transação; commit confirma esse conjunto local.

## 3. Pagamento e confirmação

Chamar o provedor fora da transação SQL, com idempotência da operação. Timeout é resultado desconhecido. Webhook autenticado ou consulta de status precisa reconciliar o resultado. Deduplicar `provider_event_id`.

Em nova transação, confirmar o pedido/reserva e gravar `purchase_confirmed` na outbox. Somente esse evento autoriza a notificação de compra confirmada. Recusa definitiva libera a reserva com compensação idempotente. Expiração não pode liberar estoque enquanto um pagamento desconhecido ainda precisa de reconciliação.

## 4. Relay, ACK e DLQ

O relay disputa eventos por lock/lease, publica com publisher confirms e só então marca `published_at`. Queda depois de publicar pode gerar duplicata. O consumidor registra evento/nome do consumidor e confirma após o efeito durável.

Efeito externo, como e-mail, exige idempotência do provedor ou política documentada de duplicata/reconciliação. Tentativas finitas usam backoff; esgotamento encaminha para DLQ. Definir alerta, retenção, responsável e reprocessamento com deduplicação.

## 5. O que verificar em uma implementação real

Concorrência de estoque, conflito da chave, transições de estado sob lock, timeout de pagamento, webhook duplicado, queda entre publish/marcação, consumidor repetido, expiração/compensação e recuperação de backup. Os CHECKs/índices do [schema](../../database/schema.sql) ajudam a preservar invariantes; não implementam o workflow.

Referências: [isolamento PostgreSQL](https://www.postgresql.org/docs/current/transaction-iso.html), [confirmações RabbitMQ](https://www.rabbitmq.com/docs/confirms).
