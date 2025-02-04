CREATE OR REPLACE FUNCTION orgs.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS orgs.subscriptions
(
    id uuid NOT NULL DEFAULT gen_random_uuid_v7(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    org_id uuid NOT NULL,
    status text COLLATE pg_catalog."default" NOT NULL,
    valid_until timestamp with time zone NOT NULL,
    plan text COLLATE pg_catalog."default" NOT NULL,
    credits integer NOT NULL DEFAULT 0,
    stripe_subscription_id text COLLATE pg_catalog."default",
    stripe_checkout_session_id text COLLATE pg_catalog."default",
    stripe_customer_id text COLLATE pg_catalog."default",
    type text COLLATE pg_catalog."default",
    CONSTRAINT subscriptions_pkey PRIMARY KEY (id),
    CONSTRAINT subscriptions_org_fkey FOREIGN KEY (org_id)
        REFERENCES orgs.organizations (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS orgs.subscriptions
    OWNER to nhost_hasura;

CREATE INDEX IF NOT EXISTS subscriptions_org_id_ix
    ON orgs.subscriptions USING btree
    (org_id ASC NULLS LAST)
    TABLESPACE pg_default;


CREATE OR REPLACE TRIGGER set_orgs_subscriptions_updated_at
    BEFORE UPDATE 
    ON orgs.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION orgs.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_orgs_subscriptions_updated_at ON orgs.subscriptions
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';