import express from 'express';
import inquirer from 'inquirer';
import { pool, comectionToDb } from './connections.js';

await connectToDb();

const app = express();
const PORT = process.env.Port || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

inquirer
    .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Add a department', 'Add a role', 'Add an employee', 'View departments', 'View roles', 'View employees', 'Update an employee role', 'Exit'],
        },
    ])
    .then((answers) => {
        switch (answers.action) {
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'View departments':
                viewDepartments();
                break;
            case 'View roles':
                viewRoles();
                break;
            case 'View employees':
                viewEmployees();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                process.exit();
        }
    });



function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'Enter the name of the department:',
            },
        ])
        .then((answers) => {
            pool.query('INSERT INTO department (name) VALUES ($1)', [answers.department], (err, res) => {
                if (err) throw err;
                console.log('Department added');
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:',
            },
            {
                type: 'number',
                name: 'salary',
                message: 'Enter the salary of the role:',
            },
            {
                type: 'number',
                name: 'department_id',
                message: 'Enter the department ID of the role:',
            },
        ])
        .then((answers) => {
            pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added');
            });
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee:',
            },
            {
                type: 'number',
                name: 'role_id',
                message: 'Enter the role ID of the employee:',
            },
            {
                type: 'number',
                name: 'manager_id',
                message: 'Enter the manager ID of the employee:',
            },
        ])
        .then((answers) => {
            pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                if (err) throw err;
                console.log('Employee added');
            });
        });
}

function viewDepartments() {
    pool.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
    });
}

function viewRoles() {
    pool.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
    });
}

function viewEmployees() {
    pool.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
    });
}

function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'number',
                name: 'employee_id',
                message: 'Enter the ID of the employee whose role you would like to update:',
            },
            {
                type: 'number',
                name: 'role_id',
                message: 'Enter the new role ID of the employee:',
            },
        ])
        .then((answers) => {
            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], (err, res) => {
                if (err) throw err;
                console.log('Employee role updated');
            });
        });
}










app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

