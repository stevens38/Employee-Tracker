import express from 'express';
import inquirer from 'inquirer';
import {pool, comectionToDb} from './connections.js';

await connectToDb();

const app = express();
const PORT = 3001;

app.use(express..urlencoded({ extended: true }));
app.use(express.json());

inquirer
    .prompt([
        {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add a department', 'Add a role', 'Add an employee', 'View departments', 'View roles', 'View employees', 'Update an employee role'],
        },
    ])
    .then((answers) => {
        console.log(answers);
    });

