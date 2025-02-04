CREATE OR REPLACE FUNCTION orgs.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS orgs.user_profiles
(
    id uuid NOT NULL DEFAULT gen_random_uuid_v7(),
    "user_id" uuid NOT NULL,
    current_org_user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT user_profiles_user_key UNIQUE ("user_id"),
    CONSTRAINT user_profiles_current_org_user_fkey FOREIGN KEY (current_org_user_id)
        REFERENCES orgs.org_users (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE RESTRICT,
    CONSTRAINT user_profiles_user_fkey FOREIGN KEY ("user_id")
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE RESTRICT
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS orgs.user_profiles
    OWNER to nhost_hasura;

CREATE OR REPLACE TRIGGER set_orgs_user_profiles_updated_at
    BEFORE UPDATE 
    ON orgs.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION orgs.set_current_timestamp_updated_at();

COMMENT ON TRIGGER set_orgs_user_profiles_updated_at ON orgs.user_profiles
    IS 'trigger to set value of column "updated_at" to current timestamp on row update';