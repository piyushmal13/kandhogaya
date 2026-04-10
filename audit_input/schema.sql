CREATE TABLE public.users (
  id uuid primary key,
  email text not null,
  role text default 'user'
);

CREATE TABLE public.products (
  id uuid primary key,
  name text not null,
  price numeric not null
);

CREATE TABLE public.platform_flags (
  flag_name text primary key,
  flag_value boolean not null,
  description text
);
