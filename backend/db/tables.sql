-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    email character varying(200) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    username character varying(45) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    first_name character varying(45) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    last_name character varying(45) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    hashed_password character varying(200) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    is_active boolean,
    role character varying(45) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    phone_number character varying COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.todos
(
    id integer NOT NULL DEFAULT nextval('todos_id_seq'::regclass),
    title character varying(200) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    description character varying(200) COLLATE pg_catalog."default" DEFAULT NULL::character varying,
    priority integer,
    complete boolean,
    owner_id integer,
    CONSTRAINT todos_pkey PRIMARY KEY (id),
    CONSTRAINT todos_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)