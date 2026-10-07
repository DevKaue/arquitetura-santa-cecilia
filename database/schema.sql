-- Gerado pelo BuildArch · PostgreSQL (postgres)

-- Catálogo público
CREATE TABLE "products" (
  "id" UUID NOT NULL,
  "sku" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "price" NUMERIC(12, 2) NOT NULL,
  PRIMARY KEY ("id")
);

-- Reserva autoritativa no checkout
CREATE TABLE "inventory" (
  "product_id" UUID NOT NULL,
  "available" INTEGER NOT NULL,
  "version" INTEGER NOT NULL,
  PRIMARY KEY ("product_id"),
  FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Um pedido por chave de idempotência
CREATE TABLE "orders" (
  "id" UUID NOT NULL,
  "idempotency_key" VARCHAR(255) NOT NULL UNIQUE,
  "status" VARCHAR(255) NOT NULL,
  "total" NUMERIC(12, 2) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL,
  "owner_subject" VARCHAR(255) NOT NULL,
  "request_hash" VARCHAR(255) NOT NULL,
  "currency" VARCHAR(255) NOT NULL,
  "updated_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("id")
);

-- Itens do pedido
CREATE TABLE "order_items" (
  "id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" NUMERIC(12, 2) NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Deduplicar webhooks e correlacionar pedido
CREATE TABLE "payment_events" (
  "id" UUID NOT NULL,
  "provider_event_id" VARCHAR(255) NOT NULL UNIQUE,
  "order_id" UUID NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "received_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id")
);

-- Evento na mesma transação do pedido
CREATE TABLE "outbox" (
  "id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "event_type" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL,
  "published" BOOLEAN NOT NULL,
  "payload" JSONB NOT NULL,
  "attempts" INTEGER NOT NULL,
  "published_at" TIMESTAMPTZ,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id")
);

-- Reserva por pedido/produto, com expiração e compensação idempotente; estado deve ser reconciliado com pagamento.
CREATE TABLE "reservations" (
  "id" UUID NOT NULL,
  "order_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "status" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("order_id") REFERENCES "orders" ("id"),
  FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

-- Chave composta deduplica o mesmo evento por consumidor. Efeito externo exige suporte de idempotência próprio.
CREATE TABLE "processed_events" (
  "event_id" UUID NOT NULL,
  "consumer_name" VARCHAR(255) NOT NULL,
  "processed_at" TIMESTAMPTZ NOT NULL,
  PRIMARY KEY ("event_id", "consumer_name"),
  FOREIGN KEY ("event_id") REFERENCES "outbox" ("id")
);

CREATE INDEX "idx_orders_owner_subject_created_at" ON "orders" ("owner_subject", "created_at");

CREATE INDEX "idx_order_items_order_id" ON "order_items" ("order_id");

CREATE INDEX "idx_order_items_product_id" ON "order_items" ("product_id");

CREATE INDEX "idx_payment_events_order_id" ON "payment_events" ("order_id");

CREATE INDEX "idx_outbox_order_id" ON "outbox" ("order_id");

CREATE INDEX "idx_outbox_published_created_at" ON "outbox" ("published", "created_at");

CREATE INDEX "idx_reservations_order_id" ON "reservations" ("order_id");

CREATE INDEX "idx_reservations_product_id" ON "reservations" ("product_id");

CREATE INDEX "idx_reservations_status_expires_at" ON "reservations" ("status", "expires_at");

-- Regras do domínio complementares ao modelo visual. Valores de demonstração.
ALTER TABLE products ADD CONSTRAINT products_price_nonnegative CHECK (price >= 0);
ALTER TABLE inventory ADD CONSTRAINT inventory_available_nonnegative CHECK (available >= 0);
ALTER TABLE inventory ADD CONSTRAINT inventory_version_nonnegative CHECK (version >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_total_nonnegative CHECK (total >= 0);
ALTER TABLE orders ADD CONSTRAINT orders_currency_format CHECK (currency ~ '^[A-Z]{3}$');
ALTER TABLE orders ADD CONSTRAINT orders_status_valid CHECK (status IN ('pending_payment','confirmed','cancelled'));
ALTER TABLE order_items ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT order_items_price_nonnegative CHECK (unit_price >= 0);
ALTER TABLE reservations ADD CONSTRAINT reservations_quantity_positive CHECK (quantity > 0);
ALTER TABLE reservations ADD CONSTRAINT reservations_status_valid CHECK (status IN ('held','confirmed','released'));
ALTER TABLE reservations ADD CONSTRAINT reservation_once_per_item UNIQUE (order_id, product_id);
ALTER TABLE outbox ADD CONSTRAINT outbox_attempts_nonnegative CHECK (attempts >= 0);
ALTER TABLE outbox ADD CONSTRAINT outbox_publish_consistent CHECK (published = (published_at IS NOT NULL));
ALTER TABLE outbox ALTER COLUMN published SET DEFAULT false;
ALTER TABLE outbox ALTER COLUMN attempts SET DEFAULT 0;
-- Não inclui trigger de transição de estado: a aplicação precisa autorizar a transição sob lock.
-- processed_events é deduplicação local; e-mail externo requer idempotência no provedor.
