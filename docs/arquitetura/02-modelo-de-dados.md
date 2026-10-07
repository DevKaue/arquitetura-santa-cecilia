# Modelo de dados — Arquitetura Santa Cecília

**Aprofundamento do exemplo:** estes detalhes de implementação complementam a palestra; não fazem parte da figura original do slide 19. A referência por slide está na [matriz de correspondência](04-correspondencia-palestra.md).

O banco principal contém oito tabelas. `orders` liga dono sintético, chave de idempotência e hash da solicitação; `reservations` explicita expiração e compensação; `outbox` e `processed_events` demonstram entrega e deduplicação.

```mermaid
erDiagram
  products {
    uuid id PK
    varchar sku UK
    varchar name
    decimal price
  }
  inventory {
    uuid product_id PK,FK
    integer available
    integer version
  }
  orders {
    uuid id PK
    varchar idempotency_key UK
    varchar status
    decimal total
    timestamp created_at
    varchar owner_subject
    varchar request_hash
    varchar currency
    timestamp updated_at
  }
  order_items {
    uuid id PK
    uuid order_id FK
    uuid product_id FK
    integer quantity
    decimal unit_price
  }
  payment_events {
    uuid id PK
    varchar provider_event_id UK
    uuid order_id FK
    varchar status
    timestamp received_at
  }
  outbox {
    uuid id PK
    uuid order_id FK
    varchar event_type
    timestamp created_at
    boolean published
    json payload
    integer attempts
    timestamp published_at
  }
  reservations {
    uuid id PK
    uuid order_id FK
    uuid product_id FK
    integer quantity
    varchar status
    timestamp expires_at
  }
  processed_events {
    uuid event_id PK,FK
    varchar consumer_name PK
    timestamp processed_at
  }
  inventory ||--|| products : "product_id"
  order_items }|--|| orders : "order_id"
  order_items }|--|| products : "product_id"
  payment_events }|--|| orders : "order_id"
  outbox }|--|| orders : "order_id"
  reservations }|--|| orders : "order_id"
  reservations }|--|| products : "product_id"
  processed_events }|--|| outbox : "event_id"

```

O SQL está em `../../database/schema.sql`, com CHECKs de estoque/quantidade/estados e unicidade de reserva. Os índices das FKs estão marcados também no Build Arch. A chave de idempotência é globalmente única neste modelo didático; um sistema por cliente pode usar unicidade composta. O domínio deve conferir dono e hash antes de retornar um pedido existente. Metadados de cliente são sintéticos. O modelo não prova concorrência correta nem executa pagamento.
