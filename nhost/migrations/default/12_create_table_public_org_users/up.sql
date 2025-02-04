CREATE OR REPLACE FUNCTION orgs.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS orgs.org_users
(
    id uuid NOT NULL DEFAULT gen_random_uuid_v7(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    org_id uuid NOT NULL,
    "user_id" uuid NOT NULL,
    role text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT org_users_pkey PRIMARY KEY (id),
    CONSTRAINT org_users_org_user_role_key UNIQUE (org_id, "user_id", role),
    CONSTRAINT org_users_org_fkey FOREIGN KEY (org_id)
        REFERENCES orgs.organizations (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE,
    CONSTRAINT org_users_user_fkey FOREIGN KEY ("user_id")
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS orgs.org_users
    OWNER to nhost_hasura;

CREATE OR REPLACE TRIGGER set_orgs_org_users_updated_at
    BEFORE UPDATE 
    ON orgs.org_users
    FOR EACH ROW
    EXECUTE FUNCTION orgs.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_orgs_org_users_updated_at ON orgs.org_users
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';