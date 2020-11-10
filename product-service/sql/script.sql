create database store;

create schema if not exists public;

create extension "uuid-ossp";

create table if not exists products
(
    id          uuid primary key default uuid_generate_v4(),
    title       text not null,
    description text,
    price       numeric,
    image_url   text,
    image_title text
);

create table if not exists stocks
(
    id         serial,
    product_id uuid,
    count      int not null,
    constraint fk_product
        foreign key (product_id) references products (id)
);

create unique index if not exists stocks_product_id_uindex
    on stocks (product_id);

insert into products (id, title, description, price, image_url, image_title)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        'Product Title 1',
        'Short Product Description 1',
        2.4,
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 1'),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        'Product Title 2',
        'Short Product Description 2',
        10,
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'imageTitle": "Image title 2'),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a2',
        'Product Title 3',
        'Short Product Description 3',
        23,
        'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 3'),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        'Product Title 4',
        'Short Product Description 4',
        15,
        'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        'Image title 4'),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        'Product Title 5',
        'Short Product Description 5',
        23,
        'https://images.unsplash.com/photo-1551029506-0807df4e2031?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 5'),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1',
        'Product Title 6',
        'Short Product Description 6',
        15,
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 6'),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2',
        'Product Title 7',
        'Short Product Description 7',
        23,
        'https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 7'),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1',
        'Product Title 8',
        'Short Product Description 8',
        15,
        'https://images.unsplash.com/photo-1575709527142-a93ed587bb83?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 8');

insert into stocks (product_id, count)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        4),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0',
        6),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a2',
        7),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1',
        12),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3',
        7),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1',
        8),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2',
        2),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1',
        3);

-- getProductsList
select count, description, p.id as id, price, title, image_url, image_title
from products p
         join stocks s on p.id = s.product_id;

-- getProductById
select count, description, p.id as id, price, title, image_url, image_title
from products p
         join stocks s on p.id = s.product_id
where p.id = ?;

-- addProduct
insert into products (id, title, description, price, image_url, image_title)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa',
        'Product Title 1',
        'Short Product Description 1',
        2.4,
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        'Image title 1')
returning id;
insert into stocks (product_id, count)
values ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 4);
