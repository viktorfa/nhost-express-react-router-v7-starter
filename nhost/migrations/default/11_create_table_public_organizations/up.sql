CREATE OR REPLACE FUNCTION orgs.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS orgs.organizations
(
    id uuid NOT NULL DEFAULT gen_random_uuid_v7(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    owner_id uuid NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL DEFAULT ''::text,
    CONSTRAINT organizations_pkey PRIMARY KEY (id),
    CONSTRAINT organizations_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS orgs.organizations
    OWNER to nhost_hasura;

CREATE OR REPLACE TRIGGER set_orgs_organizations_updated_at
    BEFORE UPDATE 
    ON orgs.organizations
    FOR EACH ROW
    EXECUTE FUNCTION orgs.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_orgs_organizations_updated_at ON orgs.organizations
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';