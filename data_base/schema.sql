Drop database if exists employee_db;
create database employee_db;
\c employee_db;
create table department(
    id int auto_increment primary key,
    name varchar(30)
);
create table role(
    id int auto_increment primary key,
    title varchar(30),
    salary decimal(10,2),
    department_id int,
    foreign key(department_id) references department(id)
);
create table employee(
    id int auto_increment primary key,
    first_name varchar(30),
    last_name varchar(30),
    foreign key(role_id) references role(id),
    foreign key(manager_id) references employee(id)
);

