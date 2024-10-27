insert into department (name)
 values ('Engineering'),
         ('Sales'),
         ('Finance'),
         ('Legal');
insert into role (title, salary, department_id)
    values ('Software Engineer', 100000, 1),
            ('Sales Lead', 80000, 2),
            ('Accountant', 70000, 3),
            ('Lawyer', 120000, 4);
insert into employee (first_name, last_name, role_id, manager_id)
    values ('Alice', 'Johnson', 1, null),
            ('Bob', 'Smith', 2, 1),
            ('Charlie', 'Davis', 3, 2),
            ('David', 'Lee', 4, 3);