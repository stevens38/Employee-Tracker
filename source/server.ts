import express from 'express';
import inqyirer from 'inquirer';
import {pool, connectToDb} from './connections.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urencoded({extended: false}));