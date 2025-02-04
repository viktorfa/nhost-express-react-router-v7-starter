CREATE TABLE IF NOT EXISTS public.constants
(
    key text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT constants_pkey PRIMARY KEY (key)
)