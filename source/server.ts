import express from 'express';
import inquirer from 'inquirer';
import { pool, connectToDb } from './connections.js';
import { QueryResult } from 'pg';
import dotenv from 'dotenv';
import Table from 'cli-table3';

dotenv.config();

const app = express();
const PORT = process.env.Port || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startInquirer = async () => {
    try {
        await connectToDb();
        inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    'View all employees',
                    'View all roles',
                    'View all departments',
                    'Add employee',
                    'Add role',
                    'Add department',
                    'Update employee role',
                    'Quit',
                ],
            },
        ]).then((answers) => {
            switch (answers.action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    process.exit();
            }
        });
    } catch (err) {
        console.error('Error starting inquirer: ', err);
    }
};

const viewAllEmployees = async () => {
    try {
        const result: QueryResult = await pool.query('SELECT employee.id AS "ID", employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS "Job Title", department.name AS "Department", role.salary AS "Salary", CONCAT(managers.first_name, \' \', managers.last_name) AS "Manager" FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee managers ON employee.manager_id = managers.id');
        const table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 15, 15],
        });
        result.rows.forEach((row) => {
            table.push([row["ID"], row["First Name"], row["Last Name"], row["Job Title"], row["Department"], row["Salary"], row["Manager"]]);
        });
        console.log(table.toString());
    } catch (err) {
        console.error('Error viewing all employees: ', err);
    } finally {
        startInquirer();
    }
}
const viewAllRoles = async () => {
    try {
        const result: QueryResult = await pool.query('SELECT role.id AS "ID", role.title AS "Title", department.name AS "Department", role.salary AS "Salary" FROM role LEFT JOIN department ON role.department_id = department.id');
        const table = new Table({
            head: ['ID', 'Title', 'Department', 'Salary'],
            colWidths: [5, 15, 15, 15],
        });
        result.rows.forEach((row) => {
            table.push([row["ID"], row["Title"], row["Department"], row["Salary"]]);
        });
        console.log(table.toString());
    } catch (err) {
        console.error('Error viewing all roles: ', err);
    } finally {
        startInquirer();
    }
}

const viewAllDepartments = async () => {
    try {
        const result: QueryResult = await pool.query('SELECT id AS "ID", name AS "Department" FROM department');
        const table = new Table({
            head: ['ID', 'Department'],
            colWidths: [5, 15],
        });
        result.rows.forEach((row) => {
            table.push([row["ID"], row["Department"]]);
        });
        console.log(table.toString());
    } catch (err) {
        console.error('Error viewing all departments: ', err);
    } finally {
        startInquirer();
    }
}

const addEmployee = async () => {
    try {
        const roles = await pool.query('SELECT id, title FROM role');
        const managers = await pool.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL');
        inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the employee\'s last name:',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the employee\'s role:',
                choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the employee\'s manager:',
                choices: managers.rows.map((manager) => ({ name: `${manager.first_name} ${manager.last_name}`, value: manager.id })),
            },
        ]).then((answers) => {
            pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
        });
    } catch (err) {
        console.error('Error adding employee: ', err);
    } finally {
        startInquirer();
    }
}

const addRole = async () => {
    try {
        const departments = await pool.query('SELECT id, name FROM department');
        inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title:',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the role salary:',
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the role department:',
                choices: departments.rows.map((department) => ({ name: department.name, value: department.id })),
            },
        ]).then((answers) => {
            pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
        });
    } catch (err) {
        console.error('Error adding role: ', err);
    } finally {
        startInquirer();
    }
}

const addDepartment = async () => {
    try {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name:',
            },
        ]).then((answers) => {
            pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
        });
    } catch (err) {
        console.error('Error adding department: ', err);
    } finally {
        startInquirer();
    }
}

const updateEmployeeRole = async () => {
    try {
        const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
        const roles = await pool.query('SELECT id, title FROM role');
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employees.rows.map((employee) => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })),
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the employee\'s new role:',
                choices: roles.rows.map((role) => ({ name: role.title, value: role.id })),
            },
        ]).then((answers) => {
            pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
        });
    } catch (err) {
        console.error('Error updating employee role: ', err);
    } finally {
        startInquirer();
    }
}

app.use((_req, res) => {
    res.status(404).send('404: Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
});

startInquirer();