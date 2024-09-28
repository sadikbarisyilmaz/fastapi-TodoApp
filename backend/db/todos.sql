-- Table: public.todos

-- DROP TABLE IF EXISTS public.todos;

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

