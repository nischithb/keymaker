CREATE TABLE "client_secrets" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"secret_hash" text NOT NULL,
	"client_id" text NOT NULL,
	"display_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "client_secrets_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"homepage_url" text NOT NULL,
	"callback_url" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "client_secrets" ADD CONSTRAINT "client_secrets_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_owner_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;