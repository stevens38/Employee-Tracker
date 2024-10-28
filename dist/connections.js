import dotenv from 'dotenv';
import pg from 'pg';
dotenv.config();
const { Pool } = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: 'localhost',
    database: process.env.DB_BASE,
    password: process.env.DB_PASS,
    port: 5432,
});
const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
    }
    catch (err) {
        console.error('Error connecting to the database: ', err);
        process.exit(1);
    }
};
console.log(process.env.DB_USER);
export { pool, connectToDb };
