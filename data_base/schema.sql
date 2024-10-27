Drop database if exists employee_db;
create database employee_db;
\c employee_db;
create table department(
    id serial primary key,
    name varchar(30)
);
create table role(
    id serial primary key,
    title varchar(30),
    salary decimal(10,2),
    department_id integer not null references department(id)
);
create table employee(
    id serial primary key,
    first_name varchar(30),
    last_name varchar(30),
    role_id integer not null references role(id),
    manager_id integer references employee(id) on delete set null
);

